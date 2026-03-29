// @ts-nocheck -- pending schema regen
// CompatibleIQ -- Notification Preferences API
// GET  /api/notifications/preferences   — get current user's preferences
// PUT  /api/notifications/preferences   — update preferences

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  getUserPreferences,
  updatePreferences,
} from '@/lib/notifications/notification-service'

// ═══════════════════════════════════════════
// GET — get preferences
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

  const preferences = await getUserPreferences(user.id)
  return NextResponse.json({ preferences })
}

// ═══════════════════════════════════════════
// PUT — update preferences
// ═══════════════════════════════════════════

export async function PUT(request: NextRequest) {
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

  // Whitelist allowed fields
  const allowedFields = [
    'push_enabled',
    'email_enabled',
    'sms_enabled',
    'quiet_hours_start',
    'quiet_hours_end',
  ] as const

  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields provided' },
      { status: 400 }
    )
  }

  const preferences = await updatePreferences(user.id, updates)

  if (!preferences) {
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }

  return NextResponse.json({ preferences })
}
