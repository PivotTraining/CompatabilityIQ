// CompatibleIQ -- Email Service
// Sends transactional emails via Resend (preferred) or falls back to Supabase auth email

import { getSupabaseServiceClient } from '@/lib/supabase/server'
import {
  welcomeEmailTemplate,
  matchNotificationTemplate,
  reportReadyTemplate,
  weeklyDigestTemplate,
  assessmentReminderTemplate,
  type WelcomeEmailData,
  type MatchNotificationData,
  type ReportReadyData,
  type WeeklyDigestData,
  type AssessmentReminderData,
} from './templates'

// ═══════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.EMAIL_FROM || 'CompatibleIQ <Hello@PivotTraining.us>'
const RESEND_ENDPOINT = 'https://api.resend.com/emails'

// ═══════════════════════════════════════════
// Base sender
// ═══════════════════════════════════════════

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Prefer Resend if configured
  if (RESEND_API_KEY) {
    return sendViaResend(to, subject, html)
  }

  // Fallback: log warning — Supabase built-in email is for auth only
  console.warn(
    '[EmailService] RESEND_API_KEY not set. Email not sent. Subject:',
    subject,
    'To:',
    to
  )
  return { success: false, error: 'No email provider configured. Set RESEND_API_KEY.' }
}

async function sendViaResend(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error('[EmailService] Resend error:', response.status, body)
      return { success: false, error: `Resend ${response.status}: ${body}` }
    }

    const data = await response.json()
    return { success: true, messageId: data.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[EmailService] sendViaResend exception:', message)
    return { success: false, error: message }
  }
}

// ═══════════════════════════════════════════
// Helper: resolve user email from Supabase auth
// ═══════════════════════════════════════════

async function getUserEmail(userId: string): Promise<string | null> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return null

  const { data, error } = await supabase.auth.admin.getUserById(userId)
  if (error || !data?.user?.email) {
    console.error('[EmailService] getUserEmail error:', error?.message ?? 'no email')
    return null
  }

  return data.user.email
}

async function getUserProfile(userId: string): Promise<{ first_name: string; email: string } | null> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', userId)
    .single()

  const email = await getUserEmail(userId)
  if (!email || !profile) return null

  return { first_name: profile.first_name || 'there', email }
}

// ═══════════════════════════════════════════
// High-level email senders
// ═══════════════════════════════════════════

export async function sendWelcomeEmail(user: {
  id: string
  email: string
  firstName?: string
}): Promise<boolean> {
  const html = welcomeEmailTemplate({
    firstName: user.firstName || 'there',
  })

  const result = await sendEmail(
    user.email,
    'Welcome to CompatibleIQ -- Let\'s find your resonance',
    html
  )
  return result.success
}

export async function sendMatchNotification(
  userId: string,
  matchName: string,
  cisScore: number
): Promise<boolean> {
  const userInfo = await getUserProfile(userId)
  if (!userInfo) return false

  const html = matchNotificationTemplate({
    firstName: userInfo.first_name,
    matchName,
    cisScore: Math.round(cisScore),
  })

  const result = await sendEmail(
    userInfo.email,
    `New Resonance: You and ${matchName} scored ${Math.round(cisScore)}`,
    html
  )
  return result.success
}

export async function sendReportReady(
  userId: string,
  matchName: string
): Promise<boolean> {
  const userInfo = await getUserProfile(userId)
  if (!userInfo) return false

  const html = reportReadyTemplate({
    firstName: userInfo.first_name,
    matchName,
  })

  const result = await sendEmail(
    userInfo.email,
    `Your Resonance Report with ${matchName} is ready`,
    html
  )
  return result.success
}

export async function sendWeeklyDigest(
  userId: string,
  stats: { newMatches: number; unreadMessages: number; profileViews: number }
): Promise<boolean> {
  const userInfo = await getUserProfile(userId)
  if (!userInfo) return false

  const html = weeklyDigestTemplate({
    firstName: userInfo.first_name,
    ...stats,
  })

  const result = await sendEmail(
    userInfo.email,
    'Your CompatibleIQ Weekly Digest',
    html
  )
  return result.success
}

export async function sendAssessmentReminder(
  userId: string,
  modulesRemaining: number
): Promise<boolean> {
  const userInfo = await getUserProfile(userId)
  if (!userInfo) return false

  const completedModules = 6 - modulesRemaining
  const html = assessmentReminderTemplate({
    firstName: userInfo.first_name,
    modulesRemaining,
    completedModules,
  })

  const result = await sendEmail(
    userInfo.email,
    `${modulesRemaining} modules left -- complete your CompatibleIQ assessment`,
    html
  )
  return result.success
}
