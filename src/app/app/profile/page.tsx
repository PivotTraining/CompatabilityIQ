'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAssessmentStore } from '@/store/assessment-store'
import { CIS_TIERS, MODULE_CONFIG, type CISTierKey } from '@/lib/constants'
import { Camera, Edit3, MapPin, Calendar, Shield, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface ProfileData {
  display_name: string
  date_of_birth: string
  gender: string
  bio: string
  location_city: string | null
  location_state: string | null
  assessment_progress: number
  cis_score: number | null
  cis_tier: CISTierKey | null
  is_verified: boolean
}

export default function ProfilePage() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [bio, setBio] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('display_name, date_of_birth, gender, bio, location_city, location_state, assessment_progress, cis_score, cis_tier, is_verified')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const row = data as unknown as ProfileData | null
        if (row) {
          setProfile(row)
          setBio(row.bio || '')
        }
      })
  }, [user, supabase])

  const saveBio = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').update({ bio } as never).eq('id', user.id)
    setProfile((p) => p ? { ...p, bio } : p)
    setSaving(false)
    setEditing(false)
  }

  const getAge = (dob: string) => {
    const diff = Date.now() - new Date(dob).getTime()
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const tier = profile.cis_tier ? CIS_TIERS[profile.cis_tier] : null
  const completedModules = profile.assessment_progress
  const percentComplete = Math.round(
    (MODULE_CONFIG.filter((_, i) => i < completedModules).reduce((s, m) => s + m.questionCount, 0) /
      MODULE_CONFIG.reduce((s, m) => s + m.questionCount, 0)) * 100
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="text-center mb-6">
        {/* Avatar placeholder */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-2"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <Camera className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
        </div>

        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {profile.display_name || 'Your Name'}
        </h1>

        <div className="flex items-center justify-center gap-2 mt-1">
          {profile.date_of_birth && (
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Calendar className="w-3.5 h-3.5" />
              {getAge(profile.date_of_birth)}
            </span>
          )}
          {profile.location_city && (
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <MapPin className="w-3.5 h-3.5" />
              {profile.location_city}{profile.location_state ? `, ${profile.location_state}` : ''}
            </span>
          )}
          {profile.is_verified && (
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--ciq-green)' }}>
              <Shield className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>

        {/* CIS badge */}
        {tier && profile.cis_score !== null && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mt-3"
            style={{ background: tier.bg, color: tier.color }}
          >
            {tier.label} — {Math.round(profile.cis_score)}
          </div>
        )}
      </div>

      {/* Assessment progress */}
      {completedModules < 6 && (
        <Link href="/app/assessment">
          <div
            className="flex items-center gap-3 p-4 rounded-2xl border mb-4"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `var(--ciq-purple)15`, color: 'var(--ciq-purple)' }}
            >
              <span className="text-sm font-bold">{percentComplete}%</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Assessment {percentComplete}% complete
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Complete all 6 modules to unlock all matches
              </p>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </div>
        </Link>
      )}

      {/* Bio */}
      <div
        className="p-4 rounded-2xl border mb-4"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>About</h3>
          <button
            onClick={() => editing ? saveBio() : setEditing(true)}
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: 'var(--ciq-purple)' }}
          >
            {editing ? (saving ? 'Saving...' : 'Save') : <><Edit3 className="w-3 h-3" /> Edit</>}
          </button>
        </div>
        {editing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Tell potential matches a little about yourself..."
            className="w-full text-sm p-2 rounded-lg border resize-none outline-none"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        ) : (
          <p className="text-sm" style={{ color: bio ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
            {bio || 'No bio yet. Tap Edit to add one.'}
          </p>
        )}
        {editing && (
          <p className="text-[10px] text-right mt-1" style={{ color: 'var(--text-muted)' }}>
            {bio.length}/500
          </p>
        )}
      </div>

      {/* Settings links */}
      <div className="space-y-2">
        {[
          { label: 'Photos', href: '/app/profile/photos' },
          { label: 'Search Preferences', href: '/app/profile/settings' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className="flex items-center justify-between p-4 rounded-2xl border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
