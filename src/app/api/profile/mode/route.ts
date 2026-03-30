// CompatibleIQ -- Mode Switch API
// PATCH /api/profile/mode
// Switches between 'dating' and 'self_discovery' mode

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

interface ModeRequestBody {
  mode: 'dating' | 'self_discovery'
}

export async function PATCH(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // 2. Parse body
    const body: ModeRequestBody = await request.json()
    const { mode } = body

    if (!mode || !['dating', 'self_discovery'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "dating" or "self_discovery"' },
        { status: 400 }
      )
    }

    // 3. Fetch current profile to check what's missing
    const { data: profile } = await supabase
      .from('profiles')
      .select('mode, interested_in, relationship_goal')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // 4. When switching to dating mode, check for missing fields
    if (mode === 'dating') {
      const missingFields: string[] = []
      if (!profile.interested_in) missingFields.push('interested_in')
      if (!profile.relationship_goal) missingFields.push('relationship_goal')

      if (missingFields.length > 0) {
        // Update mode but flag that fields are needed
        await supabase
          .from('profiles')
          .update({ mode: 'dating' } as never)
          .eq('id', user.id)

        return NextResponse.json({
          mode: 'dating',
          needsFields: missingFields,
          message: 'Switched to dating mode. Please complete your dating preferences.',
        })
      }
    }

    // 5. When switching to self_discovery, remove from active match pool
    if (mode === 'self_discovery') {
      // Update any active matches to unmatched
      await supabase
        .from('matches')
        .update({ status: 'unmatched' } as never)
        .eq('status', 'active')
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    }

    // 6. Update mode
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ mode } as never)
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      mode,
      message: mode === 'dating'
        ? 'Switched to dating mode. You are now visible in the match pool.'
        : 'Switched to self-discovery mode. You have been removed from the match pool.',
    })
  } catch (error) {
    console.error('[api/profile/mode] Error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
