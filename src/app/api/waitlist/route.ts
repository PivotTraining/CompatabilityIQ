import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = (body.email || '').trim().toLowerCase()
    const firstName = (body.firstName || '').trim() || null

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = await getSupabaseServiceClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { error } = await supabase
      .from('waitlist')
      .upsert(
        { email, first_name: firstName, source: 'homepage' },
        { onConflict: 'email' }
      )

    if (error) {
      console.error('[waitlist] insert error:', error)
      return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist] API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
