'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAssessmentStore } from '@/store/assessment-store'
import {
  CIS_TIERS,
  MODULE_CONFIG,
  LIMITS,
  getCISTier,
  type CISTierKey,
} from '@/lib/constants'
import {
  Camera,
  Edit3,
  MapPin,
  Calendar,
  Shield,
  ChevronRight,
  Plus,
  X,
  User,
  Heart,
  Bell,
  CreditCard,
  Brain,
  Check,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// ── Types ──

interface ProfileData {
  first_name: string
  date_of_birth: string | null
  gender_identity: string | null
  sexual_orientation: string | null
  relationship_goal: string | null
  bio: string | null
  location_city: string | null
  location_state: string | null
  assessment_completed: boolean
  subscription_tier: string
  photo_urls: string[] | null
  is_verified?: boolean
}

interface EditableFields {
  first_name: string
  bio: string
  location_city: string
  location_state: string
  date_of_birth: string
}

// ── Helper ──

const GENDER_LABELS: Record<string, string> = {
  woman: 'Woman',
  man: 'Man',
  nonbinary: 'Non-binary',
  self_describe: 'Self-described',
}

const ORIENTATION_LABELS: Record<string, string> = {
  straight: 'Straight',
  gay: 'Gay',
  lesbian: 'Lesbian',
  bisexual: 'Bisexual',
  pansexual: 'Pansexual',
  queer: 'Queer',
  asexual: 'Asexual',
  demisexual: 'Demisexual',
  other: 'Other',
}

const GOAL_LABELS: Record<string, string> = {
  long_term: 'Long-term relationship',
  marriage: 'Marriage',
  fun: 'Something fun',
  not_sure: 'Not sure yet',
}

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  pro: 'CIQ Pro',
  founding_member: 'Founding Member',
}

function getAge(dob: string): number {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

// ── Main Page ──

export default function ProfilePage() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const { assessmentProgress } = useAssessmentStore()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editFields, setEditFields] = useState<EditableFields>({
    first_name: '',
    bio: '',
    location_city: '',
    location_state: '',
    date_of_birth: '',
  })
  const [avgCIS, setAvgCIS] = useState<number | null>(null)
  const [displayPhotos, setDisplayPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load profile + resolve signed URLs for photos
  useEffect(() => {
    if (!user || !supabase) return
    supabase
      .from('profiles')
      .select(
        'first_name, date_of_birth, gender_identity, sexual_orientation, relationship_goal, bio, location_city, location_state, assessment_completed, subscription_tier, photo_urls'
      )
      .eq('id', user.id)
      .single()
      .then(async ({ data }) => {
        const row = data as unknown as ProfileData | null
        if (row) {
          setProfile(row)
          setEditFields({
            first_name: row.first_name || '',
            bio: row.bio || '',
            location_city: row.location_city || '',
            location_state: row.location_state || '',
            date_of_birth: row.date_of_birth || '',
          })
          // Convert storage paths → signed URLs for display
          const paths = row.photo_urls ?? []
          if (paths.length > 0) {
            const { data: signedData } = await supabase.storage
              .from('photos')
              .createSignedUrls(paths, 3600)
            if (signedData) {
              setDisplayPhotos(signedData.map((s: { signedUrl: string }) => s.signedUrl).filter(Boolean))
            }
          }
        }
      })

    // Load average CIS across matches
    supabase
      .from('matches')
      .select('cis_score')
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .eq('status', 'active')
      .then(({ data }) => {
        const rows = (data ?? []) as unknown as { cis_score: number | null }[]
        const scores = rows.filter((r) => r.cis_score !== null).map((r) => r.cis_score as number)
        if (scores.length > 0) {
          setAvgCIS(Math.round(scores.reduce((a, b) => a + b, 0) / scores.length))
        }
      })
  }, [user, supabase])

  // Save edits
  const handleSave = async () => {
    if (!user || !supabase) return
    setSaving(true)

    await supabase
      .from('profiles')
      .update({
        first_name: editFields.first_name,
        bio: editFields.bio || null,
        location_city: editFields.location_city || null,
        location_state: editFields.location_state || null,
        date_of_birth: editFields.date_of_birth || null,
      } as never)
      .eq('id', user.id)

    setProfile((p) =>
      p
        ? {
            ...p,
            first_name: editFields.first_name,
            bio: editFields.bio || null,
            location_city: editFields.location_city || null,
            location_state: editFields.location_state || null,
            date_of_birth: editFields.date_of_birth || null,
          }
        : p
    )

    setSaving(false)
    setEditing(false)
  }

  // Compress image client-side before upload (canvas resize + JPEG at 85%)
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const MAX_DIM = 1200
      const QUALITY = 0.85
      const img = new window.Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        let { width, height } = img

        // Downscale if larger than MAX_DIM on either axis
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width)
            width = MAX_DIM
          } else {
            width = Math.round((width * MAX_DIM) / height)
            height = MAX_DIM
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(file); return }
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            // Only use compressed version if it's actually smaller
            resolve(compressed.size < file.size ? compressed : file)
          },
          'image/jpeg',
          QUALITY
        )
      }

      img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
      img.src = url
    })
  }

  // Photo upload — goes through server validation at /api/photos/upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !supabase || !e.target.files?.length) return
    const raw = e.target.files[0]

    // Compress before upload — reduces avg photo from ~3MB → ~400KB
    const file = await compressImage(raw)

    const formData = new FormData()
    formData.append('photo', file) // API expects key 'photo'

    const res = await fetch('/api/photos/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('Photo upload failed:', err)
      return
    }

    // API returns { path, signedUrl, photoCount } and already updated photo_urls in DB
    const { path, signedUrl } = await res.json()

    // Update local state: storage path for profile tracking, signedUrl for display
    setProfile((p) => p ? { ...p, photo_urls: [...(p.photo_urls ?? []), path] } : p)
    setDisplayPhotos((prev) => [...prev, signedUrl])

    // Reset file input so same file can be re-selected if needed
    e.target.value = ''
  }

  // Remove photo
  const handleRemovePhoto = async (index: number) => {
    if (!user || !supabase || !profile?.photo_urls) return
    const pathToRemove = profile.photo_urls[index]
    const newPaths = profile.photo_urls.filter((_, i) => i !== index)

    // Delete from storage
    if (pathToRemove) {
      await supabase.storage.from('photos').remove([pathToRemove])
    }

    await supabase
      .from('profiles')
      .update({ photo_urls: newPaths.length > 0 ? newPaths : null } as never)
      .eq('id', user.id)

    setProfile((p) => (p ? { ...p, photo_urls: newPaths.length > 0 ? newPaths : null } : p))
    setDisplayPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Loading state ──
  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  const photos = profile.photo_urls ?? [] // storage paths (for count/tracking)
  // displayPhotos (signed URLs) is in state above — use that for <Image> src
  const completedModules = assessmentProgress
  const totalModules = MODULE_CONFIG.length
  const percentComplete = Math.round(
    (MODULE_CONFIG.filter((_, i) => i < completedModules).reduce((s, m) => s + m.questionCount, 0) /
      MODULE_CONFIG.reduce((s, m) => s + m.questionCount, 0)) *
      100
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* ── Profile Header ── */}
      <div className="text-center">
        {/* Primary photo */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 flex items-center justify-center"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          {displayPhotos[0] ? (
            <Image
              src={displayPhotos[0]}
              alt={profile.first_name}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <Camera className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
          )}
        </div>

        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {profile.first_name || 'Your Name'}
        </h1>

        <div className="flex items-center justify-center gap-3 mt-1 flex-wrap">
          {profile.date_of_birth && (
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Calendar className="w-3.5 h-3.5" />
              {getAge(profile.date_of_birth)}
            </span>
          )}
          {(profile.location_city || profile.location_state) && (
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <MapPin className="w-3.5 h-3.5" />
              {[profile.location_city, profile.location_state].filter(Boolean).join(', ')}
            </span>
          )}
        </div>

        {/* Edit toggle */}
        <button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: editing ? 'var(--ciq-purple)' : 'var(--ciq-purple-light)',
            color: editing ? '#fff' : 'var(--ciq-purple)',
          }}
        >
          {editing ? (
            saving ? (
              'Saving...'
            ) : (
              <>
                <Check className="w-3.5 h-3.5" /> Save Changes
              </>
            )
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </>
          )}
        </button>
      </div>

      {/* ── Photo Grid ── */}
      <div
        className="p-4 rounded-2xl border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Photos
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: LIMITS.maxPhotos }).map((_, i) => {
            const signedUrl = displayPhotos[i]
            return (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden relative flex items-center justify-center border"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border)',
                }}
              >
                {signedUrl ? (
                  <>
                    <Image
                      src={signedUrl}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 512px) 33vw, 160px"
                      unoptimized
                    />
                    {editing && (
                      <button
                        onClick={() => handleRemovePhoto(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center gap-1 transition-all hover:opacity-70"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px]">Add</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

      {/* ── Editable Fields ── */}
      {editing && (
        <div
          className="p-4 rounded-2xl border space-y-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Edit Info
          </h3>

          {/* First name */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              First Name
            </label>
            <input
              type="text"
              value={editFields.first_name}
              onChange={(e) => setEditFields((f) => ({ ...f, first_name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-1"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              Bio
            </label>
            <textarea
              value={editFields.bio}
              onChange={(e) => setEditFields((f) => ({ ...f, bio: e.target.value }))}
              maxLength={LIMITS.maxBioLength}
              rows={3}
              placeholder="Tell potential matches about yourself..."
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none focus:ring-1"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <p className="text-[10px] text-right mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {editFields.bio.length}/{LIMITS.maxBioLength}
            </p>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                City
              </label>
              <input
                type="text"
                value={editFields.location_city}
                onChange={(e) => setEditFields((f) => ({ ...f, location_city: e.target.value }))}
                placeholder="Austin"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-1"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                State
              </label>
              <input
                type="text"
                value={editFields.location_state}
                onChange={(e) => setEditFields((f) => ({ ...f, location_state: e.target.value }))}
                placeholder="TX"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-1"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              Date of Birth
            </label>
            <input
              type="date"
              value={editFields.date_of_birth}
              onChange={(e) => setEditFields((f) => ({ ...f, date_of_birth: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-1"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      )}

      {/* ── Bio display (non-editing) ── */}
      {!editing && (
        <div
          className="p-4 rounded-2xl border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            About
          </h3>
          <p
            className="text-sm"
            style={{ color: profile.bio ? 'var(--text-secondary)' : 'var(--text-muted)' }}
          >
            {profile.bio || 'No bio yet. Tap Edit Profile to add one.'}
          </p>
        </div>
      )}

      {/* ── Read-only info ── */}
      <div
        className="p-4 rounded-2xl border space-y-3"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Details
        </h3>
        {[
          {
            label: 'Gender',
            value: profile.gender_identity ? GENDER_LABELS[profile.gender_identity] ?? profile.gender_identity : 'Not set',
          },
          {
            label: 'Orientation',
            value: profile.sexual_orientation
              ? ORIENTATION_LABELS[profile.sexual_orientation] ?? profile.sexual_orientation
              : 'Not set',
          },
          {
            label: 'Looking for',
            value: profile.relationship_goal
              ? GOAL_LABELS[profile.relationship_goal] ?? profile.relationship_goal
              : 'Not set',
          },
          {
            label: 'Subscription',
            value: TIER_LABELS[profile.subscription_tier] ?? profile.subscription_tier,
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {item.label}
            </span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── My Resonance Score ── */}
      <div
        className="p-4 rounded-2xl border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--ciq-purple)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            My Resonance Score
          </h3>
        </div>
        {avgCIS !== null ? (
          <div className="flex items-center gap-3">
            <div
              className="text-3xl font-bold"
              style={{ color: 'var(--ciq-purple)' }}
            >
              {avgCIS}
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                {CIS_TIERS[getCISTier(avgCIS)].label}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Average across your matches
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Match with people to see your average Resonance Score here.
          </p>
        )}
      </div>

      {/* ── Assessment Progress ── */}
      <div
        className="p-4 rounded-2xl border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" style={{ color: 'var(--ciq-purple)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Assessment Progress
            </h3>
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--ciq-purple)' }}>
            {percentComplete}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-2 rounded-full mb-4 overflow-hidden"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentComplete}%`,
              background: 'var(--ciq-purple)',
            }}
          />
        </div>

        {/* Module list */}
        <div className="space-y-2">
          {MODULE_CONFIG.map((mod, idx) => {
            const isCompleted = idx < completedModules
            const isCurrent = idx === completedModules
            return (
              <Link
                key={mod.module}
                href={isCurrent || !isCompleted ? '/app/assessment' : '#'}
                className="block"
              >
                <div
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                  style={{
                    background: isCurrent ? 'var(--ciq-purple-light)' : 'transparent',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isCompleted
                        ? 'var(--ciq-green)'
                        : isCurrent
                          ? 'var(--ciq-purple)'
                          : 'var(--bg-secondary)',
                      color: isCompleted || isCurrent ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-xs font-bold">{mod.module}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{
                        color: isCompleted || isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      {mod.title}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {mod.subtitle}
                    </p>
                  </div>
                  {isCurrent && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--ciq-purple)', color: '#fff' }}
                    >
                      Next
                    </span>
                  )}
                  {isCompleted && (
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: 'var(--ciq-green)' }}
                    >
                      Retake
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Settings Section ── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h3
          className="text-sm font-semibold px-4 pt-4 pb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Settings
        </h3>
        {[
          {
            icon: Bell,
            label: 'Notification Preferences',
            href: '/app/settings/notifications',
          },
          // TODO: Re-enable once /app/settings/subscription page exists
          // {
          //   icon: CreditCard,
          //   label: 'Subscription Management',
          //   href: '/app/settings/subscription',
          // },
          {
            icon: Shield,
            label: 'Privacy & Safety',
            href: '/privacy',
          },
        ].map((item, idx) => (
          <Link key={item.href} href={item.href}>
            <div
              className="flex items-center gap-3 px-4 py-3.5 transition-all hover:opacity-70"
              style={{
                borderTop: idx > 0 ? '1px solid var(--border)' : undefined,
              }}
            >
              <item.icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
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
