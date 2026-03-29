// @ts-nocheck -- pending schema regen
// CompatibleIQ -- Notifications API
// GET  /api/notifications?limit=20&offset=0  — list notifications for current user
// PATCH /api/notifications                    — mark single or all as read

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '@/lib/notifications/notification-service'

// ═══════════════════════════════════════════
// GET — list notifications
// ═══════════════════════════════════════════

export async function GET(request: NextRequest) {
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

  const { searchParams } = request.nextUrl
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)

  const [notifications, unreadCount] = await Promise.all([
    getNotifications(user.id, limit, offset),
    getUnreadCount(user.id),
  ])

  return NextResponse.json({ notifications, unreadCount })
}

// ═══════════════════════════════════════════
// PATCH — mark as read
// ═══════════════════════════════════════════

export async function PATCH(request: NextRequest) {
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

  const body = await request.json()

  if (body.markAll) {
    const success = await markAllAsRead(user.id)
    return NextResponse.json({ success })
  }

  if (body.notificationId) {
    const success = await markAsRead(body.notificationId, user.id)
    return NextResponse.json({ success })
  }

  return NextResponse.json(
    { error: 'Provide notificationId or markAll: true' },
    { status: 400 }
  )
}
