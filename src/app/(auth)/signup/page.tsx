// @ts-nocheck
'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }} />}>
      <SignupContent />
    </Suspense>
  )
}

function SignupContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [refCode, setRefCode] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getSupabaseBrowserClient()

  // Capture referral code from URL
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setRefCode(ref)
      sessionStorage.setItem('ciq_ref_code', ref)
    } else {
      const stored = sessionStorage.getItem('ciq_ref_code')
      if (stored) setRefCode(stored)
    }
  }, [searchParams])

  const handleGoogleSignUp = async () => {
    if (!supabase) {
      setError('Service unavailable. Please try again later.')
      return
    }
    setGoogleLoading(true)
    setError('')

    const redirectUrl = refCode
      ? `${window.location.origin}/api/auth/callback?ref=${refCode}`
      : `${window.location.origin}/api/auth/callback`

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (oauthError) {
      setGoogleLoading(false)
      setError(oauthError.message)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError('Service unavailable. Please try again later.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    setLoading(false)
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('An account with this email already exists. Try logging in instead.')
      } else {
        setError(signUpError.message)
      }
    } else if (data?.user?.identities?.length === 0) {
      // Supabase returns a fake user with no identities if email already exists
      setError('An account with this email already exists. Try logging in instead.')
    } else {
      // Link referral if a code was provided
      if (refCode && data?.user?.id) {
        fetch('/api/referrals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: refCode, refereeId: data.user.id }),
        }).catch(() => {
          // Non-blocking — referral tracking failure should not break signup
        })
        sessionStorage.removeItem('ciq_ref_code')
      }
      router.push(`/verify?email=${encodeURIComponent(email)}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--ciq-purple)' }}>
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
              CompatibleIQ
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Begin your journey
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Science-driven compatibility starts here
          </p>
        </div>

        {/* Referral banner */}
        {refCode && (
          <div
            className="mb-4 p-3 rounded-xl text-center"
            style={{ background: 'linear-gradient(135deg, rgba(123,104,181,0.15), rgba(219,112,147,0.15))' }}
          >
            <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              You were referred by a friend!
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Complete Module 1 and you both get a free Resonance Report.
            </p>
          </div>
        )}

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            background: '#ffffff',
            borderColor: 'var(--border)',
            color: '#1f1f1f',
          }}
        >
          {googleLoading ? (
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#7B68B5', borderTopColor: 'transparent' }}
            />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--border-focus)]"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--border-focus)]"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: 'var(--text-muted)' }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Confirm password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              minLength={8}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--border-focus)]"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-600 accent-[var(--ciq-purple)]"
            />
            <span className="text-sm text-gray-400">
              I confirm I am 18 years or older
            </span>
          </label>

          <p className="text-xs text-gray-400 leading-relaxed">
            You must be 18 or older to use CompatibleIQ. By signing up, you confirm you meet this requirement.
          </p>

          <button
            type="submit"
            disabled={loading || googleLoading || !email || !password || !confirmPassword || !ageConfirmed}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--ciq-purple)' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs mt-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline" style={{ color: 'var(--ciq-purple)' }}>Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline" style={{ color: 'var(--ciq-purple)' }}>Privacy Policy</Link>.
          CompatibleIQ is not a clinical diagnostic tool.
        </p>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: 'var(--ciq-purple)' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
