'use client'

import { BadgeCheck, Clock, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import type { VerificationStatus } from '@/lib/supabase/types'

interface VerificationBadgeProps {
  status: VerificationStatus
  /** Compact mode shows only the icon (for cards/lists) */
  compact?: boolean
  /** Show a CTA button for unverified users on their own profile */
  showCTA?: boolean
}

export default function VerificationBadge({
  status,
  compact = false,
  showCTA = false,
}: VerificationBadgeProps) {
  if (status === 'verified') {
    return (
      <div
        className="inline-flex items-center gap-1"
        title="Verified"
      >
        <BadgeCheck
          className={compact ? 'w-4 h-4' : 'w-5 h-5'}
          style={{ color: '#3B82F6' }}
        />
        {!compact && (
          <span className="text-xs font-semibold" style={{ color: '#3B82F6' }}>
            Verified
          </span>
        )}
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div
        className="inline-flex items-center gap-1"
        title="Verification pending"
      >
        <Clock
          className={compact ? 'w-4 h-4' : 'w-5 h-5'}
          style={{ color: '#F59E0B' }}
        />
        {!compact && (
          <span className="text-xs font-semibold" style={{ color: '#F59E0B' }}>
            Pending Review
          </span>
        )}
      </div>
    )
  }

  if (status === 'rejected' && !compact) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <ShieldAlert className="w-4 h-4" style={{ color: '#EF4444' }} />
        <span className="text-xs font-medium" style={{ color: '#EF4444' }}>
          Rejected
        </span>
        {showCTA && (
          <Link
            href="/app/verify"
            className="ml-1 text-xs font-semibold underline"
            style={{ color: 'var(--ciq-purple)' }}
          >
            Try Again
          </Link>
        )}
      </div>
    )
  }

  // Unverified
  if (showCTA) {
    return (
      <Link
        href="/app/verify"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
        style={{
          background: 'var(--ciq-purple-light)',
          color: 'var(--ciq-purple)',
        }}
      >
        <BadgeCheck className="w-3.5 h-3.5" />
        Get Verified
      </Link>
    )
  }

  return null
}
