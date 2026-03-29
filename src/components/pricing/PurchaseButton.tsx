// @ts-nocheck
'use client'

// CompatibleIQ™ — Purchase / Subscribe Button Component

import { useState } from 'react'

interface PurchaseButtonProps {
  priceId: string
  matchId?: string
  label: string
  variant?: 'primary' | 'secondary' | 'coral'
  className?: string
  disabled?: boolean
  successUrl?: string
  cancelUrl?: string
}

const VARIANT_STYLES: Record<string, string> = {
  primary:
    'bg-white text-[#0a0a0f] hover:bg-white/90 focus-visible:ring-white/50',
  secondary:
    'bg-transparent text-white border border-white/30 hover:border-white/60 hover:bg-white/5 focus-visible:ring-white/30',
  coral:
    'bg-[#e8734a] text-white hover:bg-[#d4623b] focus-visible:ring-[#e8734a]/50',
}

export function PurchaseButton({
  priceId,
  matchId,
  label,
  variant = 'primary',
  className = '',
  disabled = false,
  successUrl,
  cancelUrl,
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          ...(matchId && { matchId }),
          ...(successUrl && { successUrl }),
          ...(cancelUrl && { cancelUrl }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setIsLoading(false)
    }
  }

  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handlePurchase}
        disabled={disabled || isLoading}
        className={`
          relative px-6 py-3 rounded-full font-medium text-sm
          transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyle}
          ${className}
        `}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          label
        )}
      </button>

      {error && (
        <p className="text-sm text-red-400 text-center max-w-xs">
          {error}
        </p>
      )}
    </div>
  )
}
