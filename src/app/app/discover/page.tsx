// @ts-nocheck -- pending schema regen
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAssessmentStore } from '@/store/assessment-store'
import { CIS_TIERS, getCISTier, getUnlockedProfileCount, type CISTierKey } from '@/lib/constants'
import { Heart, X, MapPin, Brain, Sparkles, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

// ── Types ──

interface DiscoverProfile {
  id: string
  first_name: string
  date_of_birth: string | null
  location_city: string | null
  location_state: string | null
  bio: string | null
  photo_urls: string[] | null
  cis_score: number | null
  cis_tier: CISTierKey | null
  gender_identity: string | null
}

interface Filters {
  gender: string
  ageMin: number
  ageMax: number
  city: string
}

// ── Score Badge Component ──

function CISBadge({ score, tier }: { score: number; tier: CISTierKey }) {
  const tierInfo = CIS_TIERS[tier]

  const badgeStyle: React.CSSProperties =
    tier === 'rare'
      ? { background: 'linear-gradient(135deg, #D4AF37, #9333EA)', color: '#fff' }
      : tier === 'synergistic'
        ? { background: '#7B68B5', color: '#fff' }
        : tier === 'compatible'
          ? { background: '#4CAF8A', color: '#fff' }
          : { background: '#E5E7EB', color: '#6B7280' }

  return (
    <div
      className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
      style={badgeStyle}
    >
      <Sparkles className="w-3 h-3" />
      {Math.round(score)} {tierInfo.label}
    </div>
  )
}

// ── Main Page ──

export default function DiscoverPage() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const { assessmentProgress } = useAssessmentStore()

  const [profiles, setProfiles] = useState<DiscoverProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    gender: 'all',
    ageMin: 18,
    ageMax: 99,
    city: '',
  })

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
    const blockedIds =
      blockRows?.flatMap((b) =>
        b.blocker_id === user.id ? [b.blocked_id] : [b.blocker_id]
      ) ?? []

    // Get existing matches to exclude
    const { data: matches } = await supabase
      .from('matches')
      .select('user_a_id, user_b_id')
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)

    const matchRows = matches as { user_a_id: string; user_b_id: string }[] | null
    const matchedIds =
      matchRows?.map((m) =>
        m.user_a_id === user.id ? m.user_b_id : m.user_a_id
      ) ?? []

    const allExclude = [...new Set([...excludeIds, ...blockedIds, ...matchedIds])]

    // Fetch eligible profiles
    let query = supabase
      .from('profiles')
      .select(
        'id, first_name, date_of_birth, location_city, location_state, bio, photo_urls, gender_identity'
      )
      .eq('assessment_completed', true)
      .not('id', 'in', `(${allExclude.join(',')})`)
      .order('created_at', { ascending: false })

    if (unlockCount !== null) {
      query = query.limit(unlockCount)
    }

    const { data } = await query
    setProfiles((data as DiscoverProfile[]) ?? [])
    setDismissed(new Set())
    setLoading(false)
  }

  const getAge = (dob: string) => {
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  const handleAction = async (profileId: string, action: 'connect' | 'dismiss') => {
    if (!user || !supabase || acting) return
    setActing(profileId)

    await supabase.from('interactions').insert({
      user_id: user.id,
      target_id: profileId,
      action,
    } as never)

    setDismissed((prev) => new Set([...prev, profileId]))
    setActing(null)
  }

  // Apply client-side filters
  const filteredProfiles = profiles.filter((p) => {
    if (dismissed.has(p.id)) return false

    if (filters.gender !== 'all' && p.gender_identity !== filters.gender) return false

    if (p.date_of_birth) {
      const age = getAge(p.date_of_birth)
      if (age < filters.ageMin || age > filters.ageMax) return false
    }

    if (filters.city) {
      const cityMatch =
        p.location_city?.toLowerCase().includes(filters.city.toLowerCase()) ||
        p.location_state?.toLowerCase().includes(filters.city.toLowerCase())
      if (!cityMatch) return false
    }

    return true
  })

  // ── Empty state: no assessment ──
  if (assessmentProgress < 1) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}
        >
          <Brain className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Complete your assessments to start discovering compatible matches
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Your compatible matches are waiting. Complete Module 1 to unlock your first 3 profiles.
        </p>
        <Link
          href="/app/assessment"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--ciq-purple)' }}
        >
          Start Assessment
        </Link>
      </div>
    )
  }

  // ── Loading ──
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
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Discover
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all"
          style={{
            borderColor: showFilters ? 'var(--ciq-purple)' : 'var(--border)',
            color: showFilters ? 'var(--ciq-purple)' : 'var(--text-secondary)',
            background: showFilters ? 'var(--ciq-purple-light)' : 'transparent',
          }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </button>
      </div>

      {/* Filter bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-5"
          >
            <div
              className="p-4 rounded-2xl border space-y-4"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              {/* Gender preference */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Gender
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'woman', label: 'Women' },
                    { value: 'man', label: 'Men' },
                    { value: 'nonbinary', label: 'Non-binary' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilters((f) => ({ ...f, gender: opt.value }))}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      style={{
                        borderColor: filters.gender === opt.value ? 'var(--ciq-purple)' : 'var(--border)',
                        color: filters.gender === opt.value ? 'var(--ciq-purple)' : 'var(--text-secondary)',
                        background: filters.gender === opt.value ? 'var(--ciq-purple-light)' : 'transparent',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age range */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Age range: {filters.ageMin} - {filters.ageMax}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={18}
                    max={99}
                    value={filters.ageMin}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setFilters((f) => ({ ...f, ageMin: Math.min(v, f.ageMax - 1) }))
                    }}
                    className="flex-1 accent-purple-600"
                  />
                  <input
                    type="range"
                    min={18}
                    max={99}
                    value={filters.ageMax}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setFilters((f) => ({ ...f, ageMax: Math.max(v, f.ageMin + 1) }))
                    }}
                    className="flex-1 accent-purple-600"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  City / State
                </label>
                <input
                  type="text"
                  placeholder="e.g. Austin, TX"
                  value={filters.city}
                  onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all focus:ring-1"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile feed */}
      {filteredProfiles.length === 0 ? (
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
          >
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {assessmentProgress < 6 ? 'Want to see more?' : "You've seen everyone"}
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
      ) : (
        <div className="space-y-5">
          <AnimatePresence>
            {filteredProfiles.map((profile) => {
              const age = profile.date_of_birth ? getAge(profile.date_of_birth) : null
              const tier = profile.cis_score ? getCISTier(profile.cis_score) : null
              const photoUrl = profile.photo_urls?.[0] ?? null

              return (
                <motion.div
                  key={profile.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="rounded-2xl border overflow-hidden shadow-sm"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                  >
                    {/* Photo section */}
                    <div
                      className="w-full aspect-[4/3] relative flex items-center justify-center"
                      style={{ background: 'var(--bg-secondary)' }}
                    >
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={profile.first_name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 512px) 100vw, 512px"
                        />
                      ) : (
                        <div className="text-center">
                          <div
                            className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
                            style={{ background: 'var(--border)' }}
                          >
                            <span className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>
                              {profile.first_name?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            No photo yet
                          </p>
                        </div>
                      )}

                      {/* CIS badge overlay */}
                      {tier && profile.cis_score !== null && (
                        <div className="absolute top-3 right-3">
                          <CISBadge score={profile.cis_score} tier={tier} />
                        </div>
                      )}
                    </div>

                    {/* Info section */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                          {profile.first_name}
                        </h2>
                        {age !== null && (
                          <span className="text-base" style={{ color: 'var(--text-secondary)' }}>
                            {age}
                          </span>
                        )}
                      </div>

                      {(profile.location_city || profile.location_state) && (
                        <p
                          className="flex items-center gap-1 text-sm mb-2"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          {[profile.location_city, profile.location_state].filter(Boolean).join(', ')}
                        </p>
                      )}

                      {profile.bio && (
                        <p
                          className="text-sm line-clamp-2 mb-3"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {profile.bio}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAction(profile.id, 'dismiss')}
                          disabled={acting === profile.id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:opacity-80 active:scale-[0.98]"
                          style={{
                            borderColor: 'var(--border)',
                            color: 'var(--text-secondary)',
                            background: 'transparent',
                          }}
                        >
                          <X className="w-4 h-4" />
                          Pass
                        </button>
                        <button
                          onClick={() => handleAction(profile.id, 'connect')}
                          disabled={acting === profile.id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                          style={{ background: 'var(--ciq-purple)' }}
                        >
                          <Heart className="w-4 h-4" />
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          <p className="text-center text-xs py-4" style={{ color: 'var(--text-muted)' }}>
            {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''} available
          </p>
        </div>
      )}
    </div>
  )
}
