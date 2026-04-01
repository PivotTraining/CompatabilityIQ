'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  Gift,
  Copy,
  Share2,
  Users,
  UserCheck,
  Award,
  ArrowLeft,
  Sparkles,
  Check,
} from 'lucide-react'
import Link from 'next/link'

interface ReferralStats {
  invitesSent: number
  converted: number
  rewardsEarned: number
}

interface ReferralRow {
  id: string
  referee_id: string | null
  status: string
  reward_claimed: boolean
  created_at: string
  converted_at: string | null
}

export default function ReferralsPage() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()

  const [code, setCode] = useState<string | null>(null)
  const [stats, setStats] = useState<ReferralStats>({ invitesSent: 0, converted: 0, rewardsEarned: 0 })
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user || !supabase) return

    // Fetch code + stats from API
    fetch('/api/referrals')
      .then((res) => res.json())
      .then((data) => {
        if (data.code) setCode(data.code)
        if (data.stats) setStats(data.stats)
      })
      .finally(() => setLoading(false))

    // Fetch detailed referral rows
    supabase
      .from('referrals')
      .select('id, referee_id, status, reward_claimed, created_at, converted_at')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setReferrals(data as unknown as ReferralRow[])
      })
  }, [user, supabase])

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

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'var(--text-muted)', bg: 'var(--bg-secondary)' },
    signed_up: { label: 'Signed Up', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    completed: { label: 'Completed', color: 'var(--ciq-green)', bg: 'rgba(34,197,94,0.1)' },
    rewarded: { label: 'Rewarded', color: 'var(--ciq-purple)', bg: 'var(--ciq-purple-light)' },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/app/profile"
          className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:opacity-70"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
        </Link>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Invite Friends
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Share CompatibleIQ and earn rewards together
          </p>
        </div>
      </div>

      {/* Reward hero */}
      <div
        className="p-5 rounded-2xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(123,104,181,0.2), rgba(219,112,147,0.2))' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" style={{ color: 'var(--ciq-purple)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Free Resonance Report
            </h2>
          </div>
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            Both you and your friend get a free Resonance Report when they sign up
            and complete Module 1 of the assessment.
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            No limit on how many friends you can invite.
          </p>
        </div>
      </div>

      {/* Referral link card */}
      <div
        className="p-4 rounded-2xl border space-y-3"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Your Referral Link
        </h3>
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
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, var(--ciq-purple), #DB7093)' }}
        >
          <Share2 className="w-4 h-4" />
          Share Invite Link
        </button>

        {/* Referral code display */}
        <div className="text-center pt-1">
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Or share your code: <span className="font-mono font-semibold" style={{ color: 'var(--ciq-purple)' }}>{code}</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Invited', value: stats.invitesSent },
          { icon: UserCheck, label: 'Joined', value: stats.converted },
          { icon: Award, label: 'Rewards', value: stats.rewardsEarned },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center p-3 rounded-2xl border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <stat.icon
              className="w-5 h-5 mx-auto mb-1.5"
              style={{ color: 'var(--ciq-purple)' }}
            />
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div
        className="p-4 rounded-2xl border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          How It Works
        </h3>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Share your link', desc: 'Send your unique referral link to a friend' },
            { step: '2', title: 'They sign up', desc: 'Your friend creates a CompatibleIQ account' },
            { step: '3', title: 'They complete Module 1', desc: 'Your friend finishes the first assessment module' },
            { step: '4', title: 'Both get rewarded', desc: 'You both receive a free Resonance Report credit' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--ciq-purple)', color: '#fff' }}
              >
                <span className="text-xs font-bold">{item.step}</span>
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral activity */}
      {referrals.filter((r) => r.referee_id).length > 0 && (
        <div
          className="p-4 rounded-2xl border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Referral Activity
          </h3>
          <div className="space-y-2">
            {referrals
              .filter((r) => r.referee_id)
              .map((r) => {
                const cfg = statusConfig[r.status] ?? statusConfig.pending
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2.5 rounded-xl"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        Friend #{r.referee_id?.slice(0, 6)}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {r.converted_at
                          ? new Date(r.converted_at).toLocaleDateString()
                          : new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
