// @ts-nocheck
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.redirect(`${origin}/login?error=auth`)
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth`)
    }

    // If a specific next route was requested, use it
    if (next) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Otherwise, check if user has completed onboarding
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, onboarding_complete')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_complete) {
        return NextResponse.redirect(`${origin}/app/assessment`)
      } else {
        return NextResponse.redirect(`${origin}/app/onboarding`)
      }
    }

    // Fallback: send to onboarding
    return NextResponse.redirect(`${origin}/app/onboarding`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
