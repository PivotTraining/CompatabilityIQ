// @ts-nocheck
// CompatibleIQ — CIQ Pulse Submit API
// POST /api/pulse/submit — Submit weekly pulse responses
// GET  /api/pulse/submit — Retrieve current + recent pulse data
import { NextResponse } from 'next/server'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'
import { getISOWeekNumber, getISOWeekYear } from '@/lib/assessment/pulse-questions'

// ─── Table Bootstrap ────────────────────────────────────

async function ensurePulseTable(
  serviceClient: ReturnType<typeof import('@supabase/supabase-js').createClient>
): Promise<void> {
  // Check if table exists by attempting a select
  const { error } = await serviceClient
    .from('pulse_responses')
    .select('id')
    .limit(1)

  if (error?.code === '42P01') {
    // Table does not exist — create it via raw SQL
    await serviceClient.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS pulse_responses (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          week_number INTEGER NOT NULL,
          year INTEGER NOT NULL,
          responses JSONB NOT NULL,
          score NUMERIC(5,2) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now(),
          UNIQUE(user_id, week_number, year)
        );
        CREATE INDEX IF NOT EXISTS idx_pulse_responses_user_week
          ON pulse_responses(user_id, year DESC, week_number DESC);
      `,
    })
  }
}

// ─── Validation ─────────────────────────────────────────

interface PulseResponseItem {
  readonly questionId: string
  readonly value: number
}

function validateResponses(
  responses: unknown
): { valid: true; data: readonly PulseResponseItem[] } | { valid: false; error: string } {
  if (!Array.isArray(responses)) {
    return { valid: false, error: 'Responses must be an array' }
  }

  if (responses.length !== 3) {
    return { valid: false, error: 'Exactly 3 responses are required' }
  }

  for (const item of responses) {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof item.questionId !== 'string' ||
      typeof item.value !== 'number'
    ) {
      return { valid: false, error: 'Each response must have questionId (string) and value (number)' }
    }
    if (item.value < 1 || item.value > 4 || !Number.isInteger(item.value)) {
      return { valid: false, error: 'Response values must be integers between 1 and 4' }
    }
  }

  return { valid: true, data: responses as readonly PulseResponseItem[] }
}

// ─── POST Handler ───────────────────────────────────────

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse and validate
    const body = await request.json()
    const validation = validateResponses(body.responses)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { data: responses } = validation

    // 3. Calculate score (average * 25 to get 0-100 scale)
    const sum = responses.reduce((acc, r) => acc + r.value, 0)
    const score = (sum / responses.length) * 25

    // 4. Get current week info
    const now = new Date()
    const weekNumber = getISOWeekNumber(now)
    const year = getISOWeekYear(now)

    // 5. Store in Supabase
    const serviceClient = await getSupabaseServiceClient()
    if (!serviceClient) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    await ensurePulseTable(serviceClient)

    // Check for duplicate submission
    const { data: existing } = await serviceClient
      .from('pulse_responses')
      .select('id')
      .eq('user_id', user.id)
      .eq('week_number', weekNumber)
      .eq('year', year)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'You have already completed this week\'s pulse' },
        { status: 409 }
      )
    }

    const { error: insertError } = await serviceClient
      .from('pulse_responses')
      .insert({
        user_id: user.id,
        week_number: weekNumber,
        year,
        responses: responses as unknown,
        score,
      } as never)

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to save pulse responses' },
        { status: 500 }
      )
    }

    // 6. Get previous week's score for trend
    const prevWeek = weekNumber === 1 ? 52 : weekNumber - 1
    const prevYear = weekNumber === 1 ? year - 1 : year

    const { data: previousPulse } = await serviceClient
      .from('pulse_responses')
      .select('score')
      .eq('user_id', user.id)
      .eq('week_number', prevWeek)
      .eq('year', prevYear)
      .maybeSingle()

    return NextResponse.json({
      success: true,
      data: {
        score,
        weekNumber,
        year,
        previousScore: previousPulse?.score ?? null,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ─── GET Handler ────────────────────────────────────────

export async function GET() {
  try {
    // 1. Authenticate
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serviceClient = await getSupabaseServiceClient()
    if (!serviceClient) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    await ensurePulseTable(serviceClient)

    // 2. Get current week info
    const now = new Date()
    const weekNumber = getISOWeekNumber(now)
    const year = getISOWeekYear(now)

    // 3. Fetch current week's pulse
    const { data: currentPulse } = await serviceClient
      .from('pulse_responses')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_number', weekNumber)
      .eq('year', year)
      .maybeSingle()

    // 4. Fetch last 4 weeks for trend data
    const { data: recentPulses } = await serviceClient
      .from('pulse_responses')
      .select('week_number, year, score, created_at')
      .eq('user_id', user.id)
      .order('year', { ascending: false })
      .order('week_number', { ascending: false })
      .limit(4)

    return NextResponse.json({
      success: true,
      data: {
        currentWeek: currentPulse ?? null,
        weekNumber,
        year,
        recentPulses: recentPulses ?? [],
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
