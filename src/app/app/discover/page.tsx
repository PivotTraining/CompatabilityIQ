// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAssessmentStore } from '@/store/assessment-store'
import { CIS_TIERS, getUnlockedProfileCount, type CISTierKey } from '@/lib/constants'
import { Heart, X, MapPin, Lock, Brain, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface DiscoverProfile {
  id: string
  display_name: string
  date_of_birth: string
  location_city: string | null
  cis_tier: CISTierKey | null
  assessment_progress: number
}

export default function DiscoverPage() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const { assessmentProgress } = useAssessmentStore()
  const [profiles, setProfiles] = useState<DiscoverProfile[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  const unlockCount = getUnlockedProfileCount(assessmentProgress)

  useEffect(() => {
    if (!user) return
    loadProfiles()
  }, [user, assessmentProgress])

  const loadProfiles = async () => {
    if (!user || !supabase) return
    setLoading(true)

    // Get existing interactions to exclude
    const { data: interactions } = await supabase
      .from('interactions')
      .select('target_id')
      .eq('user_id', user.id)

    const interactionRows = interactions as { target_id: string }[] | null
    const excludeIds = [user.id, ...(interactionRows?.map((i) => i.target_id) ?? [])]

    // Get blocked users
    const { data: blocks } = await supabase
      .from('blocks')
      .select('blocked_id, blocker_id')
      .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`)

    const blockRows = blocks as { blocker_id: string; blocked_id: string }[] | null
    const blockedIds = blockRows?.flatMap((b) =>
      b.blocker_id === user.id ? [b.blocked_id] : [b.blocker_id]
    ) ?? []

    const allExclude = [...new Set([...excludeIds, ...blockedIds])]

    // Fetch eligible profiles
    let query = supabase
      .from('profiles')
      .select('id, display_name, date_of_birth, location_city, cis_tier, assessment_progress')
      .eq('is_active', true)
      .gte('assessment_progress', 1)
      .not('id', 'in', `(${allExclude.join(',')})`)
      .order('cis_score', { ascending: false, nullsFirst: false })

    if (unlockCount !== null) {
      query = query.limit(unlockCount)
    }

    const { data } = await query

    setProfiles((data as DiscoverProfile[]) ?? [])
    setCurrentIdx(0)
    setLoading(false)
  }

  const getAge = (dob: string) => {
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  const handleAction = async (action: 'connect' | 'dismiss') => {
    if (!user || !supabase || acting) return
    const target = profiles[currentIdx]
    if (!target) return

    setActing(true)

    await supabase.from('interactions').insert({
      user_id: user.id,
      target_id: target.id,
      action,
    } as never)

    setActing(false)
    setCurrentIdx((prev) => prev + 1)
  }

  // Not enough assessment progress
  if (assessmentProgress < 1) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--bg-secondary)', color: 'var(--ciq-purple)' }}
        >
          <Brain className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Complete your first module
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Your compatible matches are waiting. Complete Module 1 to unlock your first 3 profiles.
        </p>
        <Link
          href="/app/assessment"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--ciq-purple)' }}
        >
          Start Assessment
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const currentProfile = profiles[currentIdx]

  if (!currentProfile) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
        >
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {assessmentProgress < 6 ? 'Want to see more?' : 'You\'ve seen everyone'}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {assessmentProgress < 6
            ? 'Complete more assessment modules to unlock additional compatible profiles.'
            : 'Check back later for new compatible matches in your area.'}
        </p>
        {assessmentProgress < 6 && (
          <Link
            href="/app/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--ciq-purple)' }}
          >
            Continue Assessment
          </Link>
        )}
      </div>
    )
  }

  const tier = currentProfile.cis_tier ? CIS_TIERS[currentProfile.cis_tier] : null

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Discover
      </h1>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentProfile.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Profile card */}
          <div
            className="rounded-3xl border overflow-hidden"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            {/* Photo placeholder */}
            <div
              className="w-full aspect-[3/4] flex items-center justify-center relative"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'var(--border)' }}
                >
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>
                    {currentProfile.display_name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No photo yet</p>
              </div>

              {/* CIS tier badge */}
              {tier && (
                <div
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: tier.bg, color: tier.color }}
                >
                  {tier.label}
                </div>
              )}
            </div>

            {/* Info section */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currentProfile.display_name}
                </h2>
                {currentProfile.date_of_birth && (
                  <span className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    {getAge(currentProfile.date_of_birth)}
                  </span>
                )}
              </div>
              {currentProfile.location_city && (
                <p className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <MapPin className="w-3.5 h-3.5" />
                  {currentProfile.location_city}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={() => handleAction('dismiss')}
          disabled={acting}
          className="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <X className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleAction('connect')}
          disabled={acting}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: 'var(--ciq-purple)' }}
        >
          <Heart className="w-7 h-7" />
        </button>
      </div>

      <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
        {profiles.length - currentIdx - 1} more profiles to review
      </p>
    </div>
  )
}
