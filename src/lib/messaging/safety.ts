// CompatibleIQ -- Safety & Moderation
// Report, block, and unblock users

import { getSupabaseBrowserClient } from '../supabase/client'
import type { ReportReason } from '../supabase/types'

// ─────────────────────────────────────────────
// Report a user
// ─────────────────────────────────────────────

export async function reportUser(
  reportedUserId: string,
  reason: ReportReason,
  details?: string
): Promise<void> {
  const supabase = getSupabaseBrowserClient()!

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    reported_user_id: reportedUserId,
    reason,
    details: details ?? null,
  })

  if (error) {
    console.error('Failed to report user:', error.message)
    throw new Error('Failed to submit report. Please try again.')
  }
}

// ─────────────────────────────────────────────
// Block a user (also deactivates the match)
// ─────────────────────────────────────────────

export async function blockUser(blockedUserId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()!

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Insert block record
  const { error: blockError } = await supabase.from('blocks').insert({
    blocker_id: user.id,
    blocked_id: blockedUserId,
  })

  if (blockError) {
    console.error('Failed to block user:', blockError.message)
    throw new Error('Failed to block user. Please try again.')
  }

  // Deactivate any active matches between the two users
  // Check both directions since user could be user_a or user_b
  const { error: matchErrorA } = await supabase
    .from('matches')
    .update({ status: 'blocked' })
    .eq('user_a_id', user.id)
    .eq('user_b_id', blockedUserId)
    .eq('status', 'active')

  if (matchErrorA) {
    console.error('Failed to deactivate match (A):', matchErrorA.message)
  }

  const { error: matchErrorB } = await supabase
    .from('matches')
    .update({ status: 'blocked' })
    .eq('user_a_id', blockedUserId)
    .eq('user_b_id', user.id)
    .eq('status', 'active')

  if (matchErrorB) {
    console.error('Failed to deactivate match (B):', matchErrorB.message)
  }
}

// ─────────────────────────────────────────────
// Unblock a user
// ─────────────────────────────────────────────

export async function unblockUser(blockedUserId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()!

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', blockedUserId)

  if (error) {
    console.error('Failed to unblock user:', error.message)
    throw new Error('Failed to unblock user. Please try again.')
  }
}

// ─────────────────────────────────────────────
// Check if a user is blocked (in either direction)
// ─────────────────────────────────────────────

export async function isBlocked(
  userId: string,
  otherUserId: string
): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()!

  // Check both directions: either user could have blocked the other
  const { data, error } = await supabase
    .from('blocks')
    .select('id')
    .or(
      `and(blocker_id.eq.${userId},blocked_id.eq.${otherUserId}),and(blocker_id.eq.${otherUserId},blocked_id.eq.${userId})`
    )
    .limit(1)

  if (error) {
    console.error('Failed to check block status:', error.message)
    return false
  }

  return (data?.length ?? 0) > 0
}

// ─────────────────────────────────────────────
// Get blocked user list (users the current user has blocked)
// ─────────────────────────────────────────────

export async function getBlockedUsers(): Promise<string[]> {
  const supabase = getSupabaseBrowserClient()!

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('blocks')
    .select('blocked_id')
    .eq('blocker_id', user.id)

  if (error) {
    console.error('Failed to get blocked users:', error.message)
    return []
  }

  return (data ?? []).map((row) => row.blocked_id)
}
