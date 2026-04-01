// CompatibleIQ -- Email Automation Triggers
// Direct-send functions for each email event. No external queue -- just Resend via sendTemplatedEmail.

import { sendTemplatedEmail } from './email-service'
import { welcomeTemplate } from './templates/welcome'
import { assessmentReminderTemplate } from './templates/assessment-reminder'
import { matchNotificationTemplate } from './templates/match-notification'
import { reportReadyTemplate } from './templates/report-ready'
import { weeklyDigestTemplate } from './templates/weekly-digest'

// ═══════════════════════════════════════════
// Welcome Email
// ═══════════════════════════════════════════

export async function triggerWelcomeEmail(
  userId: string,
  email: string,
  firstName: string
): Promise<boolean> {
  const html = welcomeTemplate({ firstName: firstName || 'there' })
  const result = await sendTemplatedEmail(
    email,
    "Welcome to CompatibleIQ -- Let's find your resonance",
    html
  )

  if (!result.success) {
    console.error(`[Triggers] Welcome email failed for user ${userId}:`, result.error)
  }

  return result.success
}

// ═══════════════════════════════════════════
// Assessment Reminder
// ═══════════════════════════════════════════

export async function triggerAssessmentReminder(
  userId: string,
  email: string,
  firstName: string,
  completedModules: number
): Promise<boolean> {
  const totalModules = 6
  const modulesRemaining = totalModules - completedModules

  if (modulesRemaining <= 0) return false

  const html = assessmentReminderTemplate({
    firstName: firstName || 'there',
    completedModules,
    totalModules,
  })

  const result = await sendTemplatedEmail(
    email,
    `${modulesRemaining} module${modulesRemaining === 1 ? '' : 's'} left -- complete your CompatibleIQ assessment`,
    html
  )

  if (!result.success) {
    console.error(`[Triggers] Assessment reminder failed for user ${userId}:`, result.error)
  }

  return result.success
}

// ═══════════════════════════════════════════
// New Match Notification
// ═══════════════════════════════════════════

export async function triggerNewMatchEmail(
  userId: string,
  email: string,
  firstName: string,
  matchName: string,
  cisScore: number
): Promise<boolean> {
  const html = matchNotificationTemplate({
    firstName: firstName || 'there',
    matchName,
    cisScore: Math.round(cisScore),
  })

  const result = await sendTemplatedEmail(
    email,
    `New Resonance: You and ${matchName} scored ${Math.round(cisScore)}`,
    html
  )

  if (!result.success) {
    console.error(`[Triggers] Match notification failed for user ${userId}:`, result.error)
  }

  return result.success
}

// ═══════════════════════════════════════════
// Report Ready
// ═══════════════════════════════════════════

export async function triggerReportReadyEmail(
  userId: string,
  email: string,
  firstName: string,
  reportType: string
): Promise<boolean> {
  const html = reportReadyTemplate({
    firstName: firstName || 'there',
    reportType,
  })

  const reportLabel = reportType === 'resonance'
    ? 'Resonance Report'
    : reportType === 'self-discovery'
      ? 'Self-Discovery Report'
      : 'Compatibility Report'

  const result = await sendTemplatedEmail(
    email,
    `Your ${reportLabel} is ready`,
    html
  )

  if (!result.success) {
    console.error(`[Triggers] Report ready email failed for user ${userId}:`, result.error)
  }

  return result.success
}

// ═══════════════════════════════════════════
// Weekly Digest
// ═══════════════════════════════════════════

export interface WeeklyDigestStats {
  newMatches: number
  unreadMessages: number
  profileViews: number
  assessmentProgress?: string
}

export async function triggerWeeklyDigest(
  userId: string,
  email: string,
  firstName: string,
  stats: WeeklyDigestStats
): Promise<boolean> {
  const html = weeklyDigestTemplate({
    firstName: firstName || 'there',
    ...stats,
  })

  const result = await sendTemplatedEmail(
    email,
    'Your CompatibleIQ Weekly Digest',
    html
  )

  if (!result.success) {
    console.error(`[Triggers] Weekly digest failed for user ${userId}:`, result.error)
  }

  return result.success
}
