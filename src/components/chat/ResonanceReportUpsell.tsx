'use client'

// CompatibleIQ -- Resonance Report Upsell Card
// Inline upsell shown in chat after 3+ messages exchanged

import { useState, useEffect, useCallback } from 'react'
import { STRIPE_PRICES } from '@/lib/stripe/config'

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const MESSAGE_THRESHOLD = 3
const SESSION_DISMISS_KEY_PREFIX = 'ciq:resonance-upsell-dismissed:'

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface ResonanceReportUpsellProps {
  matchId: string
  messageCount: number
  partnerName: string
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function ResonanceReportUpsell({
  matchId,
  messageCount,
  partnerName,
}: ResonanceReportUpsellProps) {
  const [reportExists, setReportExists] = useState<boolean | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dismissKey = `${SESSION_DISMISS_KEY_PREFIX}${matchId}`

  // Check sessionStorage for previous dismissal
  useEffect(() => {
    try {
      const wasDismissed = sessionStorage.getItem(dismissKey)
      if (wasDismissed === 'true') {
        setDismissed(true)
      }
    } catch {
      // sessionStorage may be unavailable in some contexts
    }
  }, [dismissKey])

  // Check if a Resonance Report already exists for this match
  useEffect(() => {
    if (messageCount < MESSAGE_THRESHOLD || dismissed) return

    const controller = new AbortController()

    async function checkReport() {
      try {
        const response = await fetch(
          `/api/reports/resonance?matchId=${encodeURIComponent(matchId)}`,
          { signal: controller.signal },
        )
        if (!response.ok) {
          setReportExists(false)
          return
        }
        const data: { exists: boolean } = await response.json()
        setReportExists(data.exists)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setReportExists(false)
      }
    }

    checkReport()

    return () => controller.abort()
  }, [matchId, messageCount, dismissed])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    try {
      sessionStorage.setItem(dismissKey, 'true')
    } catch {
      // sessionStorage may be unavailable
    }
  }, [dismissKey])

  const handleCheckout = useCallback(async () => {
    setIsCheckingOut(true)
    setError(null)

    try {
      const response = await fetch('/api/reports/resonance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Failed to start checkout' }))
        setError(data.error || 'Something went wrong')
        setIsCheckingOut(false)
        return
      }

      const data: { url: string } = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Failed to create checkout session')
        setIsCheckingOut(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setIsCheckingOut(false)
    }
  }, [matchId])

  // Don't render if: below threshold, dismissed, report already exists, or still loading
  if (messageCount < MESSAGE_THRESHOLD) return null
  if (dismissed) return null
  if (reportExists === null) return null // Still checking
  if (reportExists) return null // Already purchased

  return (
    <div className="flex justify-center my-3">
      <div
        className="relative w-full max-w-[85%] rounded-2xl p-[1px]"
        style={{
          background: 'linear-gradient(135deg, var(--ciq-purple), var(--ciq-pink), var(--ciq-purple))',
        }}
      >
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full text-xs"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}
          aria-label="Dismiss"
        >
          &times;
        </button>

        {/* Card content */}
        <div
          className="rounded-2xl px-5 py-4"
          style={{ background: 'var(--bg-card)' }}
        >
          {/* Icon */}
          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5"
              style={{ color: 'var(--ciq-purple)' }}
            >
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            <span
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: 'var(--ciq-purple)' }}
            >
              Resonance Report
            </span>
          </div>

          {/* Description */}
          <p
            className="text-sm mb-3 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Discover your compatibility blueprint with {partnerName} -- strengths,
            friction points, and conversation starters backed by psychometric data.
          </p>

          {/* Error message */}
          {error && (
            <p className="text-xs mb-2" style={{ color: 'var(--ciq-coral)' }}>
              {error}
            </p>
          )}

          {/* CTA button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, var(--ciq-purple), var(--ciq-pink))',
            }}
          >
            {isCheckingOut ? 'Opening checkout...' : 'Unlock your Resonance Report \u2014 $4.99'}
          </button>
        </div>
      </div>
    </div>
  )
}
