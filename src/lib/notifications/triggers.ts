// CompatibleIQ -- Notification Triggers
// Business-event handlers that create in-app notifications + send emails
// Each trigger checks user preferences before dispatching.

import { getSupabaseServiceClient } from '@/lib/supabase/server'
import {
  createNotification,
  shouldSendNotification,
} from './notification-service'
import {
  sendMatchNotification,
  sendReportReady,
  sendAssessmentReminder,
} from '@/lib/email/email-service'

// ═══════════════════════════════════════════
// Debounce store for message notifications
// In production, replace with Redis or similar
// ═══════════════════════════════════════════

const messageDebounceMap = new Map<string, number>()
const MESSAGE_DEBOUNCE_MS = 60_000 // 1 minute per sender-recipient pair

// ═══════════════════════════════════════════
// onNewMatch — both users get notified
// ═══════════════════════════════════════════

export async function onNewMatch(matchId: string): Promise<void> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return

  // Fetch match with both user profiles
  const { data: match, error } = await supabase
    .from('matches')
    .select('id, cis_score, user_a_id, user_b_id')
    .eq('id', matchId)
    .single()

  if (error || !match) {
    console.error('[Triggers] onNewMatch: could not load match', matchId, error?.message)
    return
  }

  const userIds = [match.user_a_id, match.user_b_id]

  // Fetch both profiles in one query
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name')
    .in('id', userIds)

  if (!profiles || profiles.length < 2) return

  const profileMap = new Map(profiles.map((p) => [p.id, p]))
  const cisScore = match.cis_score ?? 0

  for (const userId of userIds) {
    const otherUserId = userId === match.user_a_id ? match.user_b_id : match.user_a_id
    const otherProfile = profileMap.get(otherUserId)
    const otherName = otherProfile?.first_name || 'Someone'

    // In-app notification
    await createNotification({
      userId,
      type: 'new_resonance',
      title: 'New Resonance Found',
      body: `You and ${otherName} have a compatibility score of ${Math.round(cisScore)}. Check it out!`,
      data: { matchId: match.id, otherUserId, cisScore },
    })

    // Email (if allowed)
    const shouldEmail = await shouldSendNotification(userId, 'new_resonance', 'email')
    if (shouldEmail) {
      await sendMatchNotification(userId, otherName, cisScore)
    }
  }
}

// ═══════════════════════════════════════════
// onNewMessage — notify recipient (debounced)
// ═══════════════════════════════════════════

export async function onNewMessage(
  matchId: string,
  senderId: string
): Promise<void> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return

  // Resolve the recipient from the match
  const { data: match } = await supabase
    .from('matches')
    .select('user_a_id, user_b_id')
    .eq('id', matchId)
    .single()

  if (!match) return

  const recipientId =
    match.user_a_id === senderId ? match.user_b_id : match.user_a_id

  // Debounce check
  const debounceKey = `${senderId}:${recipientId}`
  const lastSent = messageDebounceMap.get(debounceKey) ?? 0
  const now = Date.now()

  if (now - lastSent < MESSAGE_DEBOUNCE_MS) return
  messageDebounceMap.set(debounceKey, now)

  // Sender name
  const { data: senderProfile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', senderId)
    .single()

  const senderName = senderProfile?.first_name || 'Someone'

  // Check preferences for push channel
  const shouldPush = await shouldSendNotification(recipientId, 'new_message', 'push')
  if (!shouldPush) return

  await createNotification({
    userId: recipientId,
    type: 'new_message',
    title: 'New Message',
    body: `${senderName} sent you a message.`,
    data: { matchId, senderId },
  })
}

// ═══════════════════════════════════════════
// onReportPurchased — notify both participants
// ═══════════════════════════════════════════

export async function onReportPurchased(
  reportId: string,
  matchId: string
): Promise<void> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return

  const { data: match } = await supabase
    .from('matches')
    .select('user_a_id, user_b_id')
    .eq('id', matchId)
    .single()

  if (!match) return

  const userIds = [match.user_a_id, match.user_b_id]

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name')
    .in('id', userIds)

  if (!profiles || profiles.length < 2) return

  const profileMap = new Map(profiles.map((p) => [p.id, p]))

  for (const userId of userIds) {
    const otherUserId = userId === match.user_a_id ? match.user_b_id : match.user_a_id
    const otherName = profileMap.get(otherUserId)?.first_name || 'your match'

    await createNotification({
      userId,
      type: 'report_available',
      title: 'Resonance Report Ready',
      body: `Your deep-dive compatibility report with ${otherName} is ready to view.`,
      data: { reportId, matchId, otherUserId },
    })

    const shouldEmail = await shouldSendNotification(userId, 'report_available', 'email')
    if (shouldEmail) {
      await sendReportReady(userId, otherName)
    }
  }
}

// ═══════════════════════════════════════════
// onAssessmentComplete — congratulate + nudge
// ═══════════════════════════════════════════

export async function onAssessmentComplete(
  userId: string,
  moduleNum: number
): Promise<void> {
  const totalModules = 6
  const modulesRemaining = totalModules - moduleNum

  if (modulesRemaining > 0) {
    // Nudge to keep going
    await createNotification({
      userId,
      type: 'assessment_reminder',
      title: 'Great Progress!',
      body: `Module ${moduleNum} complete! ${modulesRemaining} module${modulesRemaining === 1 ? '' : 's'} left to unlock your resonances.`,
      data: { moduleNum, modulesRemaining },
    })

    const shouldEmail = await shouldSendNotification(userId, 'assessment_reminder', 'email')
    if (shouldEmail) {
      await sendAssessmentReminder(userId, modulesRemaining)
    }
  } else {
    // All done!
    await createNotification({
      userId,
      type: 'assessment_reminder',
      title: 'Assessment Complete!',
      body: 'All 6 modules done. We are now calculating your compatibility scores. Your resonances will appear shortly!',
      data: { moduleNum, modulesRemaining: 0 },
    })
  }
}
