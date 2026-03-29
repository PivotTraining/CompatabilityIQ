// @ts-nocheck -- pending schema regen
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { path } = body as { path?: string }

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Storage path is required' }, { status: 400 })
    }

    // Verify ownership: path must start with user's ID
    if (!path.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: 'You can only delete your own photos' }, { status: 403 })
    }

    // Fetch current profile to confirm the path exists in photo_urls
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('photo_urls')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    const currentPhotos: string[] = profile?.photo_urls ?? []

    if (!currentPhotos.includes(path)) {
      return NextResponse.json({ error: 'Photo not found in profile' }, { status: 404 })
    }

    // Remove from Supabase Storage
    const { error: removeError } = await supabase.storage
      .from('photos')
      .remove([path])

    if (removeError) {
      console.error('Storage remove error:', removeError)
      return NextResponse.json({ error: 'Failed to delete photo from storage' }, { status: 500 })
    }

    // Update profile: remove path from photo_urls array
    const updatedPhotos = currentPhotos.filter((p) => p !== path)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ photo_urls: updatedPhotos })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json(
        { error: 'Photo removed from storage but failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      photoCount: updatedPhotos.length,
    })
  } catch (err) {
    console.error('Photo delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
