'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[CompatibleIQ] Unhandled error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">
          <span role="img" aria-label="warning">&#x26A0;&#xFE0F;</span>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-400 mb-8">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
