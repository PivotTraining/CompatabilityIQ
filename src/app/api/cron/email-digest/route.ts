// CompatibleIQ -- Weekly Email Digest Cron Endpoint
// POST /api/cron/email-digest
// Protected by CRON_SECRET. Intended to be called by Vercel Cron or similar scheduler.

import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { triggerWeeklyDigest } from '@/lib/email/triggers'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: Request) {
  // ── Auth: verify cron secret ──
  const authHeader = request.headers.get('authorization')
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await getSupabaseServiceClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  try {
    // ── 1. Query users with email digest preference enabled ──
    // Users who have email_digest enabled (or no preference row, defaulting to enabled)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, email_digest_enabled')
      .or('email_digest_enabled.is.null,email_digest_enabled.eq.true')

    if (profileError) {
      console.error('[CronDigest] Failed to fetch profiles:', profileError.message)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No eligible users' })
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weekStart = oneWeekAgo.toISOString()

    let sent = 0
    let failed = 0

    for (const profile of profiles) {
      try {
        // ── 2. Resolve user email from auth ──
        const { data: authUser } = await supabase.auth.admin.getUserById(profile.id)
        const email = authUser?.user?.email
        if (!email) continue

        // ── 3. Gather stats for this user ──

        // New matches this week
        const { count: newMatches } = await supabase
          .from('matches')
          .select('*', { count: 'exact', head: true })
          .or(`user_a.eq.${profile.id},user_b.eq.${profile.id}`)
          .gte('created_at', weekStart)

        // Unread messages
        const { count: unreadMessages } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', profile.id)
          .eq('read', false)

        // Assessment progress
        const { count: completedModules } = await supabase
          .from('assessment_responses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id)

        const assessmentProgress = completedModules != null && completedModules < 6
          ? `${completedModules}/6 modules`
          : undefined

        // ── 4. Send digest ──
        const success = await triggerWeeklyDigest(
          profile.id,
          email,
          profile.first_name || 'there',
          {
            newMatches: newMatches ?? 0,
            unreadMessages: unreadMessages ?? 0,
            profileViews: 0, // profile views not yet tracked
            assessmentProgress,
          }
        )

        if (success) {
          sent++
        } else {
          failed++
        }
      } catch (userErr) {
        console.error(`[CronDigest] Error processing user ${profile.id}:`, userErr)
        failed++
      }
    }

    return NextResponse.json({
      sent,
      failed,
      total: profiles.length,
    })
  } catch (err) {
    console.error('[CronDigest] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Also support GET for Vercel Cron (which sends GET by default)
export async function GET(request: Request) {
  return POST(request)
}
