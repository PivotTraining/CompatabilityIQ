// @ts-nocheck -- pending schema regen
// CompatibleIQ™ — Stripe Checkout Session API
// POST /api/stripe/checkout
// Creates a Stripe Checkout Session for one-time purchases or subscriptions

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import {
  STRIPE_PRICES,
  SUBSCRIPTION_PRICES,
  isValidPriceId,
  type StripePriceId,
} from '@/lib/stripe/config'
import { isFoundingMemberAvailable } from '@/lib/stripe/helpers'
import { getSupabaseServerClient } from '@/lib/supabase/server'

interface CheckoutRequestBody {
  priceId: string
  matchId?: string
  successUrl?: string
  cancelUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503 }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 2. Parse and validate the request body
    const body: CheckoutRequestBody = await request.json()
    const { priceId, matchId, successUrl, cancelUrl } = body

    if (!priceId || !isValidPriceId(priceId)) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      )
    }

    // 3. For Resonance Reports, require a matchId
    if (priceId === STRIPE_PRICES.RESONANCE_REPORT && !matchId) {
      return NextResponse.json(
        { error: 'matchId is required for Resonance Report purchases' },
        { status: 400 }
      )
    }

    // 4. For Founding Member, check if slots are available
    if (priceId === STRIPE_PRICES.FOUNDING_MEMBER) {
      const available = await isFoundingMemberAvailable()
      if (!available) {
        return NextResponse.json(
          { error: 'Founding Member slots are no longer available' },
          { status: 410 }
        )
      }
    }

    // 5. Get or create the Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, first_name')
      .eq('id', user.id)
      .single() as { data: { stripe_customer_id: string | null; first_name: string | null } | null }

    let stripeCustomerId = profile?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.first_name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      stripeCustomerId = customer.id

      // Store the Stripe customer ID in the profile
      // @ts-expect-error — Supabase types are generated separately from schema
      await supabase.from('profiles').update({ stripe_customer_id: stripeCustomerId }).eq('id', user.id)
    }

    // 6. Build the checkout session parameters
    const isSubscription = SUBSCRIPTION_PRICES.has(priceId as StripePriceId)
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      customer: stripeCustomerId,
      mode: isSubscription ? 'subscription' : 'payment',
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${origin}/app/discover?checkout=success`,
      cancel_url: cancelUrl || `${origin}/app/discover?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        price_id: priceId,
        ...(matchId && { match_id: matchId }),
      },
    }

    // For subscriptions, also store metadata on the subscription
    if (isSubscription) {
      sessionParams.subscription_data = {
        metadata: {
          supabase_user_id: user.id,
          price_id: priceId,
        },
      }
    }

    // For one-time payments, store metadata on the payment intent
    if (!isSubscription) {
      sessionParams.payment_intent_data = {
        metadata: {
          supabase_user_id: user.id,
          price_id: priceId,
          ...(matchId && { match_id: matchId }),
        },
      }
    }

    // 7. Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.url) {
      console.error('[stripe/checkout] Session created without URL:', session.id)
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[stripe/checkout] Error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
