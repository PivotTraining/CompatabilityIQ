// CompatibleIQ -- Self-Discovery Report API
// POST /api/reports/self-discovery
// Generates a self-discovery report for the authenticated user
// Creates a Stripe checkout for $4.99 or generates immediately if already paid

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { generateSelfDiscoveryReport } from '@/lib/reports/self-discovery-report'
import { stripe } from '@/lib/stripe/client'
import { STRIPE_PRICES } from '@/lib/stripe/config'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // 2. Check if report already exists
    const { data: existingReport } = await supabase
      .from('self_discovery_reports')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingReport) {
      return NextResponse.json({
        reportId: existingReport.id,
        message: 'Report already exists',
      })
    }

    // 3. Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, first_name, subscription_tier')
      .eq('id', user.id)
      .single()

    // If user is Pro or Founding Member, generate for free
    const isPremium = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'founding_member'

    if (isPremium) {
      // Generate report immediately
      const report = await generateSelfDiscoveryReport(user.id)

      await supabase
        .from('self_discovery_reports')
        .insert({
          user_id: user.id,
          report_data: report as any,
        })

      return NextResponse.json({ reportId: report.id })
    }

    // 5. Create Stripe checkout session for $4.99
    let stripeCustomerId = profile?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.first_name || undefined,
        metadata: { supabase_user_id: user.id },
      })
      stripeCustomerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId } as never)
        .eq('id', user.id)
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'payment',
      allow_promotion_codes: true,
      line_items: [
        {
          price: STRIPE_PRICES.SELF_DISCOVERY_REPORT,
          quantity: 1,
        },
      ],
      success_url: `${origin}/app/self-discovery/report?checkout=success`,
      cancel_url: `${origin}/app/self-discovery?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        product_type: 'self_discovery_report',
        price_id: STRIPE_PRICES.SELF_DISCOVERY_REPORT,
      },
      payment_intent_data: {
        metadata: {
          supabase_user_id: user.id,
          product_type: 'self_discovery_report',
          price_id: STRIPE_PRICES.SELF_DISCOVERY_REPORT,
        },
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[api/reports/self-discovery] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
