'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const handleResend = async () => {
    if (!supabase || !email) return
    setResending(true)

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    setResending(false)
    if (!error) {
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-sm text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--ciq-purple-light)' }}
        >
          <Mail className="w-7 h-7" style={{ color: 'var(--ciq-purple)' }} />
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Check your email
        </h1>

        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
          We sent a confirmation link to
        </p>
        {email && (
          <p className="text-sm font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            {email}
          </p>
        )}

        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Click the link in the email to verify your account and get started.
          Check your spam folder if you don&apos;t see it.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={resending || resent}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              background: 'var(--bg-card)',
            }}
          >
            <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
            {resent ? 'Email sent!' : resending ? 'Sending...' : 'Resend confirmation email'}
          </button>

          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }}
          />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
