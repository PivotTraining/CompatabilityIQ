'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function handleDecline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
      role="banner"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-4xl px-4 pb-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-black/90 px-5 py-4 shadow-lg backdrop-blur-sm sm:flex-row sm:justify-between sm:gap-4">
          <p className="text-center text-sm text-white/80 sm:text-left">
            We use cookies to improve your experience. By continuing, you agree to our{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={handleDecline}
              className="rounded-lg border border-white/20 px-4 py-1.5 text-sm text-white/80 transition hover:bg-white/10"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
