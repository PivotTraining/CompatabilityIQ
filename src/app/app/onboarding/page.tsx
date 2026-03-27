'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { ArrowRight } from 'lucide-react'
import type { Gender, Orientation } from '@/lib/supabase/types'

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
]

const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: 'straight', label: 'Straight' },
  { value: 'gay', label: 'Gay' },
  { value: 'lesbian', label: 'Lesbian' },
  { value: 'bisexual', label: 'Bisexual' },
  { value: 'pansexual', label: 'Pansexual' },
  { value: 'asexual', label: 'Asexual' },
  { value: 'other', label: 'Other' },
]

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [displayName, setDisplayName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [orientation, setOrientation] = useState<Orientation | ''>('')
  const [searchGenders, setSearchGenders] = useState<Gender[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleSearchGender = (g: Gender) => {
    setSearchGenders((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }

  const isValid = displayName.trim() && dob && gender && orientation && searchGenders.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !isValid) return

    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        date_of_birth: dob,
        gender: gender as Gender,
        orientation: orientation as Orientation,
        search_genders: searchGenders,
      } as never)
      .eq('id', user.id)

    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      router.replace('/app/assessment')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Let&apos;s set up your profile
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            This information helps us find your compatible matches.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              First name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your first name"
              required
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Date of birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>You must be 18+</p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              I am
            </label>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className="px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                  style={{
                    background: gender === g.value ? 'var(--ciq-purple)' : 'var(--bg-card)',
                    borderColor: gender === g.value ? 'var(--ciq-purple)' : 'var(--border)',
                    color: gender === g.value ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              I identify as
            </label>
            <div className="flex flex-wrap gap-2">
              {ORIENTATIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setOrientation(o.value)}
                  className="px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                  style={{
                    background: orientation === o.value ? 'var(--ciq-purple)' : 'var(--bg-card)',
                    borderColor: orientation === o.value ? 'var(--ciq-purple)' : 'var(--border)',
                    color: orientation === o.value ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Looking for */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              I&apos;m looking for
            </label>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => toggleSearchGender(g.value)}
                  className="px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                  style={{
                    background: searchGenders.includes(g.value) ? 'var(--ciq-purple)' : 'var(--bg-card)',
                    borderColor: searchGenders.includes(g.value) ? 'var(--ciq-purple)' : 'var(--border)',
                    color: searchGenders.includes(g.value) ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Select all that apply</p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--ciq-purple)' }}
          >
            {loading ? 'Saving...' : 'Continue to Assessment'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}
