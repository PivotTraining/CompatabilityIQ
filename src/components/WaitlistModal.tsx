'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight, Sparkles, Check } from 'lucide-react'

export default function WaitlistModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Don't show if dismissed within 14 days
    try {
      const dismissed = localStorage.getItem('ciq_waitlist_dismissed')
      if (dismissed) {
        const dismissedAt = parseInt(dismissed)
        const fourteenDays = 14 * 24 * 60 * 60 * 1000
        if (Date.now() - dismissedAt < fourteenDays) return
      }
    } catch {
      // localStorage not available
    }

    // Show after 7 seconds
    const timer = setTimeout(() => setIsOpen(true), 7000)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsOpen(false)
    try {
      localStorage.setItem('ciq_waitlist_dismissed', Date.now().toString())
    } catch {
      // ignore
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      })

      if (res.ok) {
        setSubmitted(true)
        try {
          localStorage.setItem('ciq_waitlist_dismissed', Date.now().toString())
        } catch {
          // ignore
        }
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleDismiss() }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Purple accent top bar */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #7B68B5, #9B8DD0, #C25B8A)' }} />

        <div className="p-8 lg:p-10">
          <button
            onClick={handleDismiss}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launching Soon
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                You&apos;re early.<br />
                <span style={{ color: 'var(--ciq-purple)' }}>That&apos;s exactly where<br />you want to be.</span>
              </h2>

              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                CompatibleIQ is about to change how people date. Founding Members lock in their spot — and their price — before anyone else.
              </p>

              <ul className="space-y-2 mb-7">
                {[
                  'Early access before public launch',
                  'Founding Member pricing locked forever',
                  'First shot at a real, science-backed match pool',
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div
                      className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--ciq-purple-light)' }}
                    >
                      <Check className="w-3 h-3" style={{ color: 'var(--ciq-purple)' }} />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7B68B5] focus:ring-2 focus:ring-[#7B68B5]/20 transition-all"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7B68B5] focus:ring-2 focus:ring-[#7B68B5]/20 transition-all"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-4 rounded-2xl text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-base"
                  style={{ background: 'var(--ciq-purple)' }}
                >
                  {loading ? 'Saving your spot...' : 'Claim My Spot'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-gray-400">
                No spam. No credit card. Just your spot in line.
              </p>
            </>
          ) : (
            <div className="text-center py-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'var(--ciq-purple-light)' }}
              >
                <Sparkles className="w-8 h-8" style={{ color: 'var(--ciq-purple)' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">You&apos;re in.</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                {firstName ? `${firstName}, we` : 'We'}&apos;ll reach out the moment CompatibleIQ goes live.
                You&apos;re among the first — and that matters here.
              </p>
              <button
                onClick={handleDismiss}
                className="mt-7 px-10 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: 'var(--ciq-purple)' }}
              >
                Got it
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
