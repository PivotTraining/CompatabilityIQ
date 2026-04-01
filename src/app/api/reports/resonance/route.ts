// CompatibleIQ -- Resonance Report API
// GET  /api/reports/resonance?matchId=xxx  -- check if report exists
// POST /api/reports/resonance              -- create Stripe checkout for report

import { NextRequest, NextResponse } from 'next/server'
import { STRIPE_PRICES } from '@/lib/stripe/config'
import { getSupabaseServerClient } from '@/lib/supabase/server'

// ─────────────────────────────────────────────
// GET -- Check if a Resonance Report exists for this match
// ─────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503 },
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    const matchId = request.nextUrl.searchParams.get('matchId')
    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId query parameter is required' },
        { status: 400 },
      )
    }

    // Verify the user belongs to this match
    const { data: match } = await supabase
      .from('matches')
      .select('id, user_a_id, user_b_id')
      .eq('id', matchId)
      .single()

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 },
      )
    }

    const matchRow = match as { id: string; user_a_id: string; user_b_id: string }
    if (matchRow.user_a_id !== user.id && matchRow.user_b_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 },
      )
    }

    // Check if a resonance report exists for this match (purchased by either user)
    const { data: report } = await supabase
      .from('resonance_reports')
      .select('id')
      .eq('match_id', matchId)
      .limit(1)
      .maybeSingle()

    return NextResponse.json({ exists: !!report })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Internal server error: ${message}` },
      { status: 500 },
    )
  }
}

// ─────────────────────────────────────────────
// POST -- Create Stripe Checkout for a Resonance Report
// ─────────────────────────────────────────────

interface ResonanceCheckoutBody {
  matchId: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503 },
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    const body: ResonanceCheckoutBody = await request.json()
    const { matchId } = body

    if (!matchId || typeof matchId !== 'string') {
      return NextResponse.json(
        { error: 'matchId is required' },
        { status: 400 },
      )
    }

    // Verify the user belongs to this match
    const { data: match } = await supabase
      .from('matches')
      .select('id, user_a_id, user_b_id')
      .eq('id', matchId)
      .single()

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 },
      )
    }

    const matchRow = match as { id: string; user_a_id: string; user_b_id: string }
    if (matchRow.user_a_id !== user.id && matchRow.user_b_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 },
      )
    }

    // Check if report already exists
    const { data: existing } = await supabase
      .from('resonance_reports')
      .select('id')
      .eq('match_id', matchId)
      .limit(1)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'A Resonance Report already exists for this match' },
        { status: 409 },
      )
    }

    // Delegate to the existing Stripe checkout endpoint
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const checkoutResponse = await fetch(`${origin}/api/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify({
        priceId: STRIPE_PRICES.RESONANCE_REPORT,
        matchId,
        successUrl: `${origin}/app/chat/${matchId}?report=purchased`,
        cancelUrl: `${origin}/app/chat/${matchId}`,
      }),
    })

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.json().catch(() => ({ error: 'Checkout failed' }))
      return NextResponse.json(
        { error: errorData.error || 'Failed to create checkout session' },
        { status: checkoutResponse.status },
      )
    }

    const checkoutData: { url: string } = await checkoutResponse.json()
    return NextResponse.json({ url: checkoutData.url })
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      )
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Internal server error: ${message}` },
      { status: 500 },
    )
  }
}
