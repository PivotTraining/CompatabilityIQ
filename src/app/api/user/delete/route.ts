// CompatibleIQ -- GDPR Account Deletion API
// POST /api/user/delete
// Cascading deletion of all user data + Supabase Auth user

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'

const CONFIRMATION_PHRASE = 'DELETE MY ACCOUNT'

interface DeletionResult {
  table: string
  success: boolean
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate via session client
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

    // 2. Validate confirmation phrase
    const body = await request.json()
    if (body.confirmation !== CONFIRMATION_PHRASE) {
      return NextResponse.json(
        { error: `You must send { "confirmation": "${CONFIRMATION_PHRASE}" } to proceed.` },
        { status: 400 }
      )
    }

    // 3. Get service role client for cascading deletes
    const serviceClient = await getSupabaseServiceClient()
    if (!serviceClient) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const userId = user.id
    const results: DeletionResult[] = []

    // Helper: delete from a table and record result
    async function deleteFrom(
      table: string,
      filter: () => ReturnType<ReturnType<typeof serviceClient.from>['delete']>
    ): Promise<void> {
      try {
        const { error } = await filter()
        results.push({ table, success: !error, error: error?.message })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        results.push({ table, success: false, error: message })
      }
    }

    // 4. Log to audit before deletion (best-effort; audit_log may not exist yet)
    try {
      await serviceClient.from('audit_log').insert({
        user_id: userId,
        action: 'account_deletion_initiated',
        metadata: { email: user.email, timestamp: new Date().toISOString() },
      })
    } catch {
      // audit_log table may not exist — continue anyway
    }

    // 5. Cascading deletion in dependency order

    // 5a. Messages (sender)
    await deleteFrom('messages', () =>
      serviceClient.from('messages').delete().eq('sender_id', userId)
    )

    // 5b. Matches (either side)
    await deleteFrom('matches', () =>
      serviceClient
        .from('matches')
        .delete()
        .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    )

    // 5c. Resonance reports (purchased_by — depends on matches, so delete after)
    await deleteFrom('resonance_reports', () =>
      serviceClient.from('resonance_reports').delete().eq('purchased_by', userId)
    )

    // 5d. Self-discovery reports
    await deleteFrom('self_discovery_reports', () =>
      serviceClient.from('self_discovery_reports').delete().eq('user_id', userId)
    )

    // 5e. Dimension scores
    await deleteFrom('dimension_scores', () =>
      serviceClient.from('dimension_scores').delete().eq('user_id', userId)
    )

    // 5f. Assessment responses
    await deleteFrom('assessment_responses', () =>
      serviceClient.from('assessment_responses').delete().eq('user_id', userId)
    )

    // 5g. Photos — delete from Supabase storage bucket
    try {
      const { data: profile } = await serviceClient
        .from('profiles')
        .select('photo_urls')
        .eq('id', userId)
        .single()

      if (profile?.photo_urls && profile.photo_urls.length > 0) {
        // Extract storage paths from full URLs
        const paths = profile.photo_urls
          .map((url: string) => {
            const match = url.match(/\/storage\/v1\/object\/public\/photos\/(.+)/)
            return match ? match[1] : null
          })
          .filter(Boolean) as string[]

        if (paths.length > 0) {
          await serviceClient.storage.from('photos').remove(paths)
        }
      }
      results.push({ table: 'storage:photos', success: true })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      results.push({ table: 'storage:photos', success: false, error: message })
    }

    // 5h. Notifications
    await deleteFrom('notifications', () =>
      serviceClient.from('notifications').delete().eq('user_id', userId)
    )

    // 5i. Notification preferences
    await deleteFrom('notification_preferences', () =>
      serviceClient.from('notification_preferences').delete().eq('user_id', userId)
    )

    // 5j. Blocks (either side)
    await deleteFrom('blocks', () =>
      serviceClient
        .from('blocks')
        .delete()
        .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`)
    )

    // 5k. Reports (either side)
    await deleteFrom('reports', () =>
      serviceClient
        .from('reports')
        .delete()
        .or(`reporter_id.eq.${userId},reported_user_id.eq.${userId}`)
    )

    // 5l. Referrals
    await deleteFrom('referrals', () =>
      serviceClient
        .from('referrals')
        .delete()
        .or(`referrer_id.eq.${userId},referee_id.eq.${userId}`)
    )

    // 5m. Payments
    await deleteFrom('payments', () =>
      serviceClient.from('payments').delete().eq('user_id', userId)
    )

    // 5n. Profile (must be last before auth user)
    await deleteFrom('profiles', () =>
      serviceClient.from('profiles').delete().eq('id', userId)
    )

    // 5o. Delete Supabase Auth user via admin API
    let authDeletion: DeletionResult
    try {
      const { error } = await serviceClient.auth.admin.deleteUser(userId)
      authDeletion = { table: 'auth.users', success: !error, error: error?.message }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      authDeletion = { table: 'auth.users', success: false, error: message }
    }
    results.push(authDeletion)

    // 6. Determine overall status
    const failures = results.filter((r) => !r.success)
    const allSucceeded = failures.length === 0

    return NextResponse.json({
      success: allSucceeded,
      message: allSucceeded
        ? 'Account and all associated data have been permanently deleted.'
        : 'Account deletion partially completed. Some steps encountered errors.',
      results,
    })
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
