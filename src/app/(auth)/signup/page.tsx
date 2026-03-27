'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { ArrowRight, Mail } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = getSupabaseBrowserClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-sm text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--ciq-purple)', color: 'white' }}
          >
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Check your email
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            We sent a confirmation link to <strong>{email}</strong>
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm font-medium"
            style={{ color: 'var(--ciq-purple)' }}
          >
            Use a different email
          </button>
        </div>
      </div>
    )
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
            No social login. No Instagram imports. Just science.
          </p>
        </div>

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
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
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

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--ciq-purple)' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs mt-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
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
