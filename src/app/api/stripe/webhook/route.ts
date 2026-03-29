// @ts-nocheck -- pending schema regen
// CompatibleIQ™ — Stripe Webhook Handler
// POST /api/stripe/webhook
// Handles Stripe events for payments, subscriptions, and invoices

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import {
  STRIPE_PRICES,
  PRICE_TO_PRODUCT_TYPE,
  PRICE_TO_TIER,
  PRICE_AMOUNTS,
  isValidPriceId,
} from '@/lib/stripe/config'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import type { PaymentProductType, SubscriptionTier } from '@/lib/supabase/types'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    )
  }

  // 1. Verify the webhook signature
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe/webhook] Signature verification failed:', message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // 2. Get admin Supabase client for database operations
  const supabase = await getSupabaseServiceClient()
  if (!supabase) {
    console.error('[stripe/webhook] Supabase service client unavailable')
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    )
  }

  // 3. Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break

      default:
        console.log(`[stripe/webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`[stripe/webhook] Error handling ${event.type}:`, error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// ─── Event Handlers ──────────────────────────────────────────────

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: NonNullable<Awaited<ReturnType<typeof getSupabaseServiceClient>>>
) {
  const userId = session.metadata?.supabase_user_id
  const priceId = session.metadata?.price_id
  const matchId = session.metadata?.match_id

  if (!userId || !priceId) {
    console.error('[stripe/webhook] checkout.session.completed missing metadata:', {
      userId,
      priceId,
      sessionId: session.id,
    })
    return
  }

  if (!isValidPriceId(priceId)) {
    console.error('[stripe/webhook] Unknown price ID in checkout:', priceId)
    return
  }

  const productType = PRICE_TO_PRODUCT_TYPE[priceId]
  const amountCents = PRICE_AMOUNTS[priceId]

  if (session.mode === 'payment') {
    // ── One-time purchase (Resonance Report) ──
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id || null

    // Insert payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        stripe_payment_intent_id: paymentIntentId,
        product_type: productType as PaymentProductType,
        amount_cents: amountCents,
        currency: session.currency || 'usd',
        status: 'succeeded',
      })

    if (paymentError) {
      console.error('[stripe/webhook] Failed to insert payment:', paymentError)
    }

    // Generate Resonance Report if this is a report purchase
    if (priceId === STRIPE_PRICES.RESONANCE_REPORT && matchId) {
      await generateResonanceReport(userId, matchId, paymentIntentId, supabase)
    }
  } else if (session.mode === 'subscription') {
    // ── Subscription purchase ──
    const subscriptionId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id || null

    // Insert payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        product_type: productType as PaymentProductType,
        amount_cents: amountCents,
        currency: session.currency || 'usd',
        status: 'succeeded',
      })

    if (paymentError) {
      console.error('[stripe/webhook] Failed to insert subscription payment:', paymentError)
    }

    // Update the user's subscription tier
    const tier = PRICE_TO_TIER[priceId]
    if (tier) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ subscription_tier: tier as SubscriptionTier })
        .eq('id', userId)

      if (profileError) {
        console.error('[stripe/webhook] Failed to update subscription tier:', profileError)
      } else {
        console.log(`[stripe/webhook] User ${userId} upgraded to ${tier}`)
      }
    }
  }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: NonNullable<Awaited<ReturnType<typeof getSupabaseServiceClient>>>
) {
  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    console.error('[stripe/webhook] subscription.updated missing supabase_user_id metadata')
    return
  }

  // Determine the new tier based on the subscription's current price
  const priceId = subscription.items.data[0]?.price?.id
  if (!priceId || !isValidPriceId(priceId)) {
    console.error('[stripe/webhook] subscription.updated has unknown price:', priceId)
    return
  }

  const tier = PRICE_TO_TIER[priceId]

  if (subscription.status === 'active' && tier) {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_tier: tier as SubscriptionTier })
      .eq('id', userId)

    if (error) {
      console.error('[stripe/webhook] Failed to update tier on subscription change:', error)
    } else {
      console.log(`[stripe/webhook] User ${userId} subscription updated to ${tier}`)
    }
  } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
    console.warn(`[stripe/webhook] User ${userId} subscription status: ${subscription.status}`)
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: NonNullable<Awaited<ReturnType<typeof getSupabaseServiceClient>>>
) {
  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    console.error('[stripe/webhook] subscription.deleted missing supabase_user_id metadata')
    return
  }

  // Downgrade the user back to free
  const { error } = await supabase
    .from('profiles')
    .update({ subscription_tier: 'free' as SubscriptionTier })
    .eq('id', userId)

  if (error) {
    console.error('[stripe/webhook] Failed to downgrade user on subscription cancellation:', error)
  } else {
    console.log(`[stripe/webhook] User ${userId} downgraded to free (subscription cancelled)`)
  }
}

async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: NonNullable<Awaited<ReturnType<typeof getSupabaseServiceClient>>>
) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id || 'unknown'

  console.error('[stripe/webhook] Payment failed:', {
    invoiceId: invoice.id,
    customerId,
    amountDue: invoice.amount_due,
    attemptCount: invoice.attempt_count,
  })

  // Look up the user by stripe_customer_id and send a notification
  if (customerId !== 'unknown') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (profile) {
      await supabase.from('notifications').insert({
        user_id: profile.id,
        type: 'assessment_reminder', // closest available type
        title: 'Payment Failed',
        body: 'Your subscription payment failed. Please update your payment method to keep your CIQ Pro benefits.',
        data: { event: 'payment_failed' },
      })
    }
  }
}

// ─── Report Generation ───────────────────────────────────────────

async function generateResonanceReport(
  userId: string,
  matchId: string,
  paymentIntentId: string | null,
  supabase: NonNullable<Awaited<ReturnType<typeof getSupabaseServiceClient>>>
) {
  try {
    // Fetch the match data
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single()

    if (matchError || !match) {
      console.error('[stripe/webhook] Failed to fetch match for report:', matchError)
      return
    }

    // Verify the user is part of this match
    if (match.user_a_id !== userId && match.user_b_id !== userId) {
      console.error('[stripe/webhook] User not part of match:', { userId, matchId })
      return
    }

    // Build report data from the match's dimension scores
    // The full report generation logic will be expanded as the CIS engine matures
    const reportData: Record<string, unknown> = {
      match_id: matchId,
      cis_score: match.cis_score,
      dimension_scores: match.dimension_scores,
      generated_at: new Date().toISOString(),
      version: '1.0',
    }

    // Insert the resonance report
    const { error: reportError } = await supabase
      .from('resonance_reports')
      .insert({
        match_id: matchId,
        purchased_by: userId,
        stripe_payment_intent_id: paymentIntentId,
        report_data: reportData,
      })

    if (reportError) {
      console.error('[stripe/webhook] Failed to insert resonance report:', reportError)
    } else {
      console.log(`[stripe/webhook] Resonance report generated for match ${matchId}`)
    }
  } catch (error) {
    console.error('[stripe/webhook] Report generation error:', error)
  }
}
