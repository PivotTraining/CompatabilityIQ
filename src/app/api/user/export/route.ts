// CompatibleIQ -- GDPR Data Export API
// GET /api/user/export
// Returns all user data as a downloadable JSON file

import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userId = user.id

    // Fetch all user data in parallel
    const [
      profileResult,
      dimensionScoresResult,
      assessmentResponsesResult,
      matchesResult,
      messagesResult,
      paymentsResult,
      selfDiscoveryReportsResult,
      resonanceReportsResult,
      notificationsResult,
      blocksResult,
      reportsResult,
      referralsResult,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('dimension_scores').select('*').eq('user_id', userId),
      supabase
        .from('assessment_responses')
        .select('id, dimension_id, completed_at, user_id')
        .eq('user_id', userId),
      supabase
        .from('matches')
        .select('*')
        .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`),
      supabase
        .from('messages')
        .select('id, match_id, content_type, created_at, read_at')
        .eq('sender_id', userId),
      supabase.from('payments').select('*').eq('user_id', userId),
      supabase.from('self_discovery_reports').select('*').eq('user_id', userId),
      supabase.from('resonance_reports').select('*').eq('purchased_by', userId),
      supabase.from('notifications').select('*').eq('user_id', userId),
      supabase
        .from('blocks')
        .select('*')
        .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`),
      supabase
        .from('reports')
        .select('*')
        .or(`reporter_id.eq.${userId},reported_user_id.eq.${userId}`),
      supabase
        .from('referrals')
        .select('*')
        .or(`referrer_id.eq.${userId},referee_id.eq.${userId}`),
    ])

    const exportData = {
      exported_at: new Date().toISOString(),
      user_id: userId,
      email: user.email,
      profile: profileResult.data ?? null,
      dimension_scores: dimensionScoresResult.data ?? [],
      assessment_responses: assessmentResponsesResult.data ?? [],
      matches: matchesResult.data ?? [],
      messages_sent: messagesResult.data ?? [],
      payments: paymentsResult.data ?? [],
      self_discovery_reports: selfDiscoveryReportsResult.data ?? [],
      resonance_reports: resonanceReportsResult.data ?? [],
      notifications: notificationsResult.data ?? [],
      blocks: blocksResult.data ?? [],
      reports: reportsResult.data ?? [],
      referrals: referralsResult.data ?? [],
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="compatibleiq-data-export.json"',
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
