// CompatibleIQ -- Notification Service
// Core CRUD operations for the notifications & notification_preferences tables

import type {
  Notification,
  NotificationInsert,
  NotificationPreference,
  NotificationType,
} from '@/lib/supabase/types'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'

// ═══════════════════════════════════════════
// Types
// ═══════════════════════════════════════════

export type NotificationChannel = 'push' | 'email' | 'sms'

export interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  body: string
  data?: Record<string, unknown>
}

export interface NotificationPreferencesUpdate {
  push_enabled?: boolean
  email_enabled?: boolean
  sms_enabled?: boolean
  quiet_hours_start?: string
  quiet_hours_end?: string
}

// ═══════════════════════════════════════════
// Create
// ═══════════════════════════════════════════

export async function createNotification({
  userId,
  type,
  title,
  body,
  data,
}: CreateNotificationParams): Promise<Notification | null> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return null

  const insert: NotificationInsert = {
    user_id: userId,
    type,
    title,
    body,
    data: data ?? {},
  }

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert(insert)
    .select()
    .single()

  if (error) {
    console.error('[NotificationService] createNotification error:', error.message)
    return null
  }

  return notification
}

// ═══════════════════════════════════════════
// Read — paginated, newest first
// ═══════════════════════════════════════════

export async function getNotifications(
  userId: string,
  limit = 20,
  offset = 0
): Promise<Notification[]> {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('[NotificationService] getNotifications error:', error.message)
    return []
  }

  return data ?? []
}

// ═══════════════════════════════════════════
// Mark as read — single
// ═══════════════════════════════════════════

export async function markAsRead(
  notificationId: string,
  userId: string
): Promise<boolean> {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return false

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)

  if (error) {
    console.error('[NotificationService] markAsRead error:', error.message)
    return false
  }

  return true
}

// ═══════════════════════════════════════════
// Mark all as read
// ═══════════════════════════════════════════

export async function markAllAsRead(userId: string): Promise<boolean> {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return false

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) {
    console.error('[NotificationService] markAllAsRead error:', error.message)
    return false
  }

  return true
}

// ═══════════════════════════════════════════
// Unread count
// ═══════════════════════════════════════════

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) {
    console.error('[NotificationService] getUnreadCount error:', error.message)
    return 0
  }

  return count ?? 0
}

// ═══════════════════════════════════════════
// Preferences — get
// ═══════════════════════════════════════════

export async function getUserPreferences(
  userId: string
): Promise<NotificationPreference | null> {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('[NotificationService] getUserPreferences error:', error.message)
    return null
  }

  return data
}

// ═══════════════════════════════════════════
// Preferences — update
// ═══════════════════════════════════════════

export async function updatePreferences(
  userId: string,
  prefs: NotificationPreferencesUpdate
): Promise<NotificationPreference | null> {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('notification_preferences')
    .update(prefs)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('[NotificationService] updatePreferences error:', error.message)
    return null
  }

  return data
}

// ═══════════════════════════════════════════
// Helper: should we send this notification?
// Checks user preferences and quiet hours.
// ═══════════════════════════════════════════

export async function shouldSendNotification(
  userId: string,
  type: NotificationType,
  channel: NotificationChannel
): Promise<boolean> {
  const prefs = await getUserPreferences(userId)
  if (!prefs) return false

  // Channel-level check
  if (channel === 'push' && !prefs.push_enabled) return false
  if (channel === 'email' && !prefs.email_enabled) return false
  if (channel === 'sms' && !prefs.sms_enabled) return false

  // Quiet hours check (applies to push and sms, not email)
  if (channel !== 'email') {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const start = prefs.quiet_hours_start // e.g. "22:00"
    const end = prefs.quiet_hours_end     // e.g. "08:00"

    if (start && end) {
      const inQuietHours =
        start <= end
          ? currentTime >= start && currentTime < end        // same-day range (e.g. 01:00-05:00)
          : currentTime >= start || currentTime < end        // overnight range  (e.g. 22:00-08:00)

      if (inQuietHours) return false
    }
  }

  return true
}
