// @ts-nocheck
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import type {
  GenderIdentity,
  SexualOrientation,
  InterestedIn,
  RelationshipGoal,
} from '@/lib/supabase/types'

// ─── Constants ───────────────────────────────────────────

const STEPS = ['About You', 'Preferences', 'Goals'] as const
const TOTAL_STEPS = STEPS.length

const GENDER_OPTIONS: { value: GenderIdentity; label: string }[] = [
  { value: 'woman', label: 'Woman' },
  { value: 'man', label: 'Man' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'self_describe', label: 'Self-describe' },
]

const ORIENTATION_OPTIONS: { value: SexualOrientation; label: string }[] = [
  { value: 'straight', label: 'Straight' },
  { value: 'gay', label: 'Gay' },
  { value: 'lesbian', label: 'Lesbian' },
  { value: 'bisexual', label: 'Bisexual' },
  { value: 'pansexual', label: 'Pansexual' },
  { value: 'queer', label: 'Queer' },
  { value: 'asexual', label: 'Asexual' },
  { value: 'demisexual', label: 'Demisexual' },
  { value: 'other', label: 'Other' },
]

const INTERESTED_IN_OPTIONS: { value: InterestedIn; label: string }[] = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'everyone', label: 'Everyone' },
  { value: 'self_describe', label: 'Self-describe' },
]

const RELATIONSHIP_GOAL_OPTIONS: { value: RelationshipGoal; label: string }[] = [
  { value: 'long_term', label: 'Long-term relationship' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'fun', label: 'Something casual' },
  { value: 'not_sure', label: 'Not sure yet' },
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

// ─── Component ───────────────────────────────────────────

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1: About You
  const [firstName, setFirstName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [locationState, setLocationState] = useState('')

  // Step 2: Preferences
  const [genderIdentity, setGenderIdentity] = useState<GenderIdentity | ''>('')
  const [sexualOrientation, setSexualOrientation] = useState<SexualOrientation | ''>('')
  const [interestedIn, setInterestedIn] = useState<InterestedIn | ''>('')

  // Step 3: Goals
  const [relationshipGoal, setRelationshipGoal] = useState<RelationshipGoal | ''>('')

  // ─── Validation ──────────────────────────────────────

  const isStep1Valid = firstName.trim() && dateOfBirth && locationCity.trim() && locationState
  const isStep2Valid = genderIdentity && sexualOrientation && interestedIn
  const isStep3Valid = relationshipGoal

  const isCurrentStepValid = step === 0 ? isStep1Valid : step === 1 ? isStep2Valid : isStep3Valid

  // ─── Navigation ──────────────────────────────────────

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setDirection('forward')
      setStep((s) => s + 1)
    }
  }, [step])

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection('backward')
      setStep((s) => s - 1)
    }
  }, [step])

  // ─── Submit ──────────────────────────────────────────

  const handleSubmit = async () => {
    if (!user || !supabase) return
    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('profiles')
      .update({
        first_name: firstName.trim(),
        date_of_birth: dateOfBirth,
        location_city: locationCity.trim(),
        location_state: locationState,
        gender_identity: genderIdentity as GenderIdentity,
        sexual_orientation: sexualOrientation as SexualOrientation,
        interested_in: interestedIn as InterestedIn,
        relationship_goal: relationshipGoal as RelationshipGoal,
      } as never)
      .eq('id', user.id)

    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      router.replace('/app/assessment')
    }
  }

  // ─── Pill Button ─────────────────────────────────────

  const PillButton = ({
    selected,
    onClick,
    children,
  }: {
    selected: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200"
      style={{
        background: selected ? 'var(--ciq-purple)' : 'var(--bg-card)',
        borderColor: selected ? 'var(--ciq-purple)' : 'var(--border)',
        color: selected ? 'white' : 'var(--text-primary)',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {children}
    </button>
  )

  // ─── Progress Bar ────────────────────────────────────

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                background: i < step ? 'var(--ciq-green)' : i === step ? 'var(--ciq-purple)' : 'var(--bg-card)',
                color: i <= step ? 'white' : 'var(--text-muted)',
                border: i > step ? '2px solid var(--border)' : 'none',
              }}
            >
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span
              className="text-xs font-medium hidden sm:inline"
              style={{ color: i === step ? 'var(--text-primary)' : 'var(--text-muted)' }}
            >
              {label}
            </span>
            {i < TOTAL_STEPS - 1 && (
              <div
                className="w-8 sm:w-16 h-0.5 mx-1 rounded-full transition-all duration-300"
                style={{
                  background: i < step ? 'var(--ciq-green)' : 'var(--border)',
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
            background: 'var(--ciq-purple)',
          }}
        />
      </div>
    </div>
  )

  // ─── Step Content ────────────────────────────────────

  const renderStep = () => {
    const animationClass = direction === 'forward'
      ? 'animate-slide-in-right'
      : 'animate-slide-in-left'

    if (step === 0) {
      return (
        <div key="step-0" className={animationClass}>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            About You
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Let&apos;s start with the basics.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                required
                maxLength={50}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--border-focus)]"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Date of birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--border-focus)]"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>You must be 18 or older</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                City
              </label>
              <input
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="e.g. Austin"
                required
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--border-focus)]"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                State
              </label>
              <select
                value={locationState}
                onChange={(e) => setLocationState(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--border-focus)]"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: locationState ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                <option value="">Select state</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div key="step-1" className={animationClass}>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Preferences
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Help us understand who you are and who you&apos;re looking for.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2.5" style={{ color: 'var(--text-primary)' }}>
                I identify as
              </label>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <PillButton
                    key={g.value}
                    selected={genderIdentity === g.value}
                    onClick={() => setGenderIdentity(g.value)}
                  >
                    {g.label}
                  </PillButton>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2.5" style={{ color: 'var(--text-primary)' }}>
                Sexual orientation
              </label>
              <div className="flex flex-wrap gap-2">
                {ORIENTATION_OPTIONS.map((o) => (
                  <PillButton
                    key={o.value}
                    selected={sexualOrientation === o.value}
                    onClick={() => setSexualOrientation(o.value)}
                  >
                    {o.label}
                  </PillButton>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2.5" style={{ color: 'var(--text-primary)' }}>
                I&apos;m interested in
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTED_IN_OPTIONS.map((i) => (
                  <PillButton
                    key={i.value}
                    selected={interestedIn === i.value}
                    onClick={() => setInterestedIn(i.value)}
                  >
                    {i.label}
                  </PillButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key="step-2" className={animationClass}>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Relationship Goals
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          What are you looking for? No wrong answers.
        </p>

        <div className="space-y-3">
          {RELATIONSHIP_GOAL_OPTIONS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setRelationshipGoal(g.value)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 text-left"
              style={{
                background: relationshipGoal === g.value ? 'var(--ciq-purple)' : 'var(--bg-card)',
                borderColor: relationshipGoal === g.value ? 'var(--ciq-purple)' : 'var(--border)',
                color: relationshipGoal === g.value ? 'white' : 'var(--text-primary)',
                transform: relationshipGoal === g.value ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: relationshipGoal === g.value ? 'white' : 'var(--border)',
                  background: relationshipGoal === g.value ? 'white' : 'transparent',
                }}
              >
                {relationshipGoal === g.value && (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--ciq-purple)' }} />
                )}
              </div>
              {g.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── Render ──────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--ciq-purple)' }}>
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
              CompatibleIQ
            </span>
          </div>
        </div>

        <ProgressBar />

        <div className="overflow-hidden">
          {renderStep()}
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-4">{error}</p>
        )}

        <div className="flex items-center gap-3 mt-8">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:opacity-80"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                background: 'var(--bg-card)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <button
            type="button"
            onClick={step === TOTAL_STEPS - 1 ? handleSubmit : goNext}
            disabled={!isCurrentStepValid || loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--ciq-purple)' }}
          >
            {loading
              ? 'Saving...'
              : step === TOTAL_STEPS - 1
                ? 'Continue to Assessment'
                : 'Continue'
            }
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Step transition animations */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
