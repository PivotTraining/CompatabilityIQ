// CompatibleIQ -- Referrals API
// GET  /api/referrals          — return user's referral code + stats
// POST /api/referrals          — validate a referral code during signup

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'

// Generate a unique 8-char alphanumeric code
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ═══════════════════════════════════════════
// GET — return referral code + stats
// ═══════════════════════════════════════════

export async function GET() {
  const supabase = await getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user already has a referral code (look for any row where they are the referrer)
  const { data: existing } = await supabase
    .from('referrals')
    .select('code')
    .eq('referrer_id', user.id)
    .limit(1)
    .single()

  let code: string

  if (existing?.code) {
    code = existing.code
  } else {
    // Generate a new unique code and create a placeholder row
    let unique = false
    code = generateCode()

    while (!unique) {
      const { data: collision } = await supabase
        .from('referrals')
        .select('id')
        .eq('code', code)
        .limit(1)
        .single()

      if (!collision) {
        unique = true
      } else {
        code = generateCode()
      }
    }

    // Insert a seed row so the code is reserved
    await supabase.from('referrals').insert({
      referrer_id: user.id,
      code,
      status: 'pending',
    } as never)
  }

  // Gather stats
  const { data: allReferrals } = await supabase
    .from('referrals')
    .select('status, reward_claimed')
    .eq('referrer_id', user.id)

  const rows = (allReferrals ?? []) as unknown as {
    status: string
    reward_claimed: boolean
  }[]

  const invitesSent = rows.length
  const converted = rows.filter(
    (r) => r.status === 'signed_up' || r.status === 'completed' || r.status === 'rewarded'
  ).length
  const rewardsEarned = rows.filter((r) => r.status === 'rewarded' || r.reward_claimed).length

  return NextResponse.json({
    code,
    stats: {
      invitesSent,
      converted,
      rewardsEarned,
    },
  })
}

// ═══════════════════════════════════════════
// POST — validate referral code during signup
// Body: { code: string, refereeId: string }
// ═══════════════════════════════════════════

export async function POST(request: NextRequest) {
  const serviceClient = await getSupabaseServiceClient()
  if (!serviceClient) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  let body: { code?: string; refereeId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { code, refereeId } = body

  if (!code || !refereeId) {
    return NextResponse.json(
      { error: 'code and refereeId are required' },
      { status: 400 }
    )
  }

  // Find a referral row with this code
  const { data: referral } = await serviceClient
    .from('referrals')
    .select('id, referrer_id, referee_id, status')
    .eq('code', code)
    .limit(1)
    .single()

  if (!referral) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
  }

  // Prevent self-referral
  if ((referral as { referrer_id: string }).referrer_id === refereeId) {
    return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 })
  }

  const ref = referral as { id: string; referrer_id: string; referee_id: string | null; status: string }

  // If this specific row already has a referee, create a new row for the new referee
  if (ref.referee_id && ref.referee_id !== refereeId) {
    // Create a new referral record for the same referrer/code
    await serviceClient.from('referrals').insert({
      referrer_id: ref.referrer_id,
      referee_id: refereeId,
      code,
      status: 'signed_up',
      converted_at: new Date().toISOString(),
    } as never)
  } else {
    // Update the existing row
    await serviceClient
      .from('referrals')
      .update({
        referee_id: refereeId,
        status: 'signed_up',
        converted_at: new Date().toISOString(),
      } as never)
      .eq('id', ref.id)
  }

  return NextResponse.json({ success: true, referrerId: ref.referrer_id })
}
