import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['approved', 'rejected'] as const
type ModerationStatus = (typeof VALID_STATUSES)[number]

function isValidStatus(value: unknown): value is ModerationStatus {
  return typeof value === 'string' && VALID_STATUSES.includes(value as ModerationStatus)
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate the requesting user
    const authClient = await getSupabaseServerClient()
    if (!authClient) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { data: { user }, error: authError } = await authClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin access
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail || user.email !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse and validate request body
    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { photoId, status } = body as { photoId: unknown; status: unknown }

    if (typeof photoId !== 'string' || photoId.trim().length === 0) {
      return NextResponse.json({ error: 'photoId is required' }, { status: 400 })
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    // Use service client to bypass RLS for admin operations
    const serviceClient = await getSupabaseServiceClient()
    if (!serviceClient) {
      return NextResponse.json({ error: 'Service client not configured' }, { status: 500 })
    }

    const { error: updateError } = await serviceClient
      .from('photos')
      .update({ moderation_status: status })
      .eq('id', photoId)

    if (updateError) {
      console.error('Photo moderation update failed:', updateError.message)
      return NextResponse.json({ error: 'Failed to update moderation status' }, { status: 500 })
    }

    return NextResponse.json({ success: true, photoId, status })
  } catch (err: unknown) {
    console.error('Photo moderation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
