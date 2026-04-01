'use client'

import { useEffect, useState } from 'react'
import { Gift, Copy, Share2, Users, UserCheck, Award } from 'lucide-react'

interface ReferralStats {
  invitesSent: number
  converted: number
  rewardsEarned: number
}

interface ReferralCardProps {
  compact?: boolean
}

export default function ReferralCard({ compact = false }: ReferralCardProps) {
  const [code, setCode] = useState<string | null>(null)
  const [stats, setStats] = useState<ReferralStats>({ invitesSent: 0, converted: 0, rewardsEarned: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/referrals')
      .then((res) => res.json())
      .then((data) => {
        if (data.code) setCode(data.code)
        if (data.stats) setStats(data.stats)
      })
      .finally(() => setLoading(false))
  }, [])

  const referralUrl = code ? `https://compatibleiq.com/signup?ref=${code}` : ''

  const handleShare = async () => {
    const shareData = {
      title: 'Join me on CompatibleIQ',
      text: 'Take the compatibility assessment and we both get a free Resonance Report!',
      url: referralUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Silent fail
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Silent fail
    }
  }

  if (loading) {
    return (
      <div
        className="p-4 rounded-2xl border animate-pulse"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="h-4 rounded w-1/3 mb-3" style={{ background: 'var(--bg-secondary)' }} />
        <div className="h-10 rounded-xl w-full" style={{ background: 'var(--bg-secondary)' }} />
      </div>
    )
  }

  if (compact) {
    return (
      <div
        className="p-4 rounded-2xl border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(123,104,181,0.2), rgba(219,112,147,0.2))' }}
          >
            <Gift className="w-4.5 h-4.5" style={{ color: 'var(--ciq-purple)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Invite Friends, Get Rewards
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Both of you earn a free Resonance Report
            </p>
          </div>
          {stats.converted > 0 && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}
            >
              {stats.converted} joined
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="p-5 rounded-2xl border space-y-4"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Gift className="w-4 h-4" style={{ color: 'var(--ciq-purple)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Invite Friends
        </h3>
      </div>

      {/* Reward banner */}
      <div
        className="p-3 rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(123,104,181,0.15), rgba(219,112,147,0.15))' }}
      >
        <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
          Both you and your friend get a free Resonance Report!
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Your friend signs up and completes Module 1 to unlock the reward.
        </p>
      </div>

      {/* Referral link */}
      <div>
        <label className="text-[10px] font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
          Your referral link
        </label>
        <div className="flex gap-2">
          <div
            className="flex-1 px-3 py-2.5 rounded-xl text-xs truncate border"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {referralUrl}
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-2.5 rounded-xl border transition-all hover:opacity-80 flex items-center gap-1.5"
            style={{
              borderColor: 'var(--border)',
              background: copied ? 'var(--ciq-purple)' : 'var(--bg-secondary)',
              color: copied ? '#fff' : 'var(--text-primary)',
            }}
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, var(--ciq-purple), #DB7093)' }}
      >
        <Share2 className="w-4 h-4" />
        Share Invite Link
      </button>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Invited', value: stats.invitesSent },
          { icon: UserCheck, label: 'Joined', value: stats.converted },
          { icon: Award, label: 'Rewards', value: stats.rewardsEarned },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center p-2.5 rounded-xl"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <stat.icon
              className="w-4 h-4 mx-auto mb-1"
              style={{ color: 'var(--ciq-purple)' }}
            />
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
