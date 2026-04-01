'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const STORAGE_KEY = 'pwa-install-dismissed'
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

function isDismissedRecently(): boolean {
  if (typeof window === 'undefined') return true
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return false
  const dismissedAt = Number(stored)
  if (Number.isNaN(dismissedAt)) return false
  return Date.now() - dismissedAt < DISMISS_DURATION_MS
}

function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone)
  )
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  const handleBeforeInstall = useCallback((e: Event) => {
    e.preventDefault()
    const promptEvent = e as BeforeInstallPromptEvent
    setDeferredPrompt(promptEvent)

    if (!isDismissedRecently() && isMobileViewport() && !isStandalone()) {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [handleBeforeInstall])

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setVisible(false)
      setDeferredPrompt(null)
    }
  }

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    setVisible(false)
    setDeferredPrompt(null)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
      role="banner"
      aria-label="Install app prompt"
    >
      <div className="mx-auto max-w-md px-4 pb-4">
        <div className="rounded-xl bg-black/90 px-5 py-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="CompatibleIQ"
              width={40}
              height={40}
              className="shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">CompatibleIQ</p>
              <p className="text-xs text-white/60">
                Add to your home screen for the best experience
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 rounded-lg bg-[#7B68B5] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6a59a3]"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
