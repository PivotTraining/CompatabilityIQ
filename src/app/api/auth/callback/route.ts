// @ts-nocheck
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { triggerWelcomeEmail } from '@/lib/email/triggers'

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

      // Send welcome email to new users (those who haven't completed onboarding)
      if (!profile?.onboarding_complete) {
        triggerWelcomeEmail(
          user.id,
          user.email ?? '',
          profile?.display_name?.split(' ')[0] || 'there'
        ).catch((err) => console.error('[AuthCallback] Welcome email error:', err))

        return NextResponse.redirect(`${origin}/app/onboarding`)
      }

      return NextResponse.redirect(`${origin}/app/assessment`)
    }

    // Fallback: send to onboarding
    return NextResponse.redirect(`${origin}/app/onboarding`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
