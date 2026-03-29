'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { DIMENSION_CONFIGS } from '@/lib/scoring/constants'
import CIQCard from '@/components/cards/CIQCard'
import {
  Brain,
  Heart,
  MessageCircle,
  Sparkles,
  Target,
  Users,
  ArrowRight,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────

interface DimensionData {
  dimensionId: string
  dimensionName: string
  overallScore: number
  subScaleScores: Record<string, number>
  attachmentStyle?: string
  conflictApproach?: string
  loveLangProfile?: {
    receivingLanguages: string[]
    givingLanguages: string[]
    receivingTally: Record<string, number>
    givingTally: Record<string, number>
    flexibilityScore: number
  }
}

// ─── Constants ──────────────────────────────────────────

const DIMENSION_COLORS: Record<string, string> = {
  values: '#7B68B5',
  attachment: '#5B8DB8',
  communication: '#D4A017',
  emotional_intelligence: '#E8735A',
  lifestyle_ambition: '#4CAF8A',
  love_languages: '#C25B8A',
}

const DIMENSION_ICONS: Record<string, typeof Brain> = {
  values: Target,
  attachment: Heart,
  communication: MessageCircle,
  emotional_intelligence: Brain,
  lifestyle_ambition: Sparkles,
  love_languages: Heart,
}

const ATTACHMENT_LABELS: Record<string, string> = {
  secure: 'Secure',
  anxious_preoccupied: 'Anxious-Preoccupied',
  dismissive_avoidant: 'Dismissive-Avoidant',
  fearful_avoidant: 'Fearful-Avoidant',
  earned_secure: 'Earned Secure',
}

const ATTACHMENT_EXPLANATIONS: Record<string, string> = {
  secure: 'You feel comfortable with closeness and independence. You trust your partner and can communicate your needs without anxiety.',
  anxious_preoccupied: 'You crave closeness and can worry about your partner\'s availability. You feel deeply and invest heavily in relationships.',
  dismissive_avoidant: 'You value independence and may feel uncomfortable with too much closeness. You\'re self-reliant and prefer emotional autonomy.',
  fearful_avoidant: 'You want closeness but also fear it. You may oscillate between reaching out and pulling away.',
  earned_secure: 'You\'ve developed security through self-work and awareness. Your attachment started insecure but you\'ve grown into stability.',
}

const CONFLICT_LABELS: Record<string, string> = {
  confronter: 'Confronter',
  avoider: 'Avoider',
  collaborator: 'Collaborator',
  accommodator: 'Accommodator',
  unclassified: 'Adaptive',
}

const CONFLICT_STRENGTHS: Record<string, string[]> = {
  confronter: ['Direct and honest', 'Issues get addressed quickly', 'Partners know where they stand'],
  avoider: ['Keeps things calm', 'Avoids unnecessary escalation', 'Thoughtful before reacting'],
  collaborator: ['Seeks win-win solutions', 'De-escalates naturally', 'Both partners feel heard'],
  accommodator: ['Prioritizes harmony', 'Flexible and adaptable', 'Partner feels valued'],
  unclassified: ['Adaptable to situation', 'No rigid conflict patterns', 'Can match partner\'s style'],
}

const CONFLICT_WEAKNESSES: Record<string, string[]> = {
  confronter: ['Can overwhelm quieter partners', 'May escalate before partner is ready', 'Directness can feel aggressive'],
  avoider: ['Issues can fester unaddressed', 'Partner may feel unheard', 'Resentment can build silently'],
  collaborator: ['May over-process issues', 'Can become people-pleasing', 'Sometimes you need to just decide'],
  accommodator: ['Own needs may go unmet', 'Can lead to resentment', 'Partner may not know your real position'],
  unclassified: ['No reliable default under stress', 'May confuse partners', 'Inconsistent conflict patterns'],
}

const LOVE_LANGUAGE_LABELS: Record<string, string> = {
  words_of_affirmation: 'Words of Affirmation',
  acts_of_service: 'Acts of Service',
  receiving_gifts: 'Receiving Gifts',
  quality_time: 'Quality Time',
  physical_touch: 'Physical Touch',
}

// ─── Component ──────────────────────────────────────────

export default function SelfDiscoveryDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [loading, setLoading] = useState(true)
  const [dimensions, setDimensions] = useState<DimensionData[]>([])
  const [profile, setProfile] = useState<{
    firstName: string
    locationCity: string | null
    locationState: string | null
  } | null>(null)
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [reportPurchased, setReportPurchased] = useState(false)
  const [purchasingReport, setPurchasingReport] = useState(false)
  const [showCIQCard, setShowCIQCard] = useState(false)

  // Fetch data
  useEffect(() => {
    if (!user || !supabase) return

    const fetchData = async () => {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, location_city, location_state, assessment_completed')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile({
          firstName: profileData.first_name || 'You',
          locationCity: profileData.location_city,
          locationState: profileData.location_state,
        })
        setAssessmentComplete(!!profileData.assessment_completed)
      }

      // Fetch dimension scores
      const { data: scores } = await supabase
        .from('dimension_scores')
        .select('*')
        .eq('user_id', user.id)

      if (scores && scores.length > 0) {
        const dims: DimensionData[] = scores.map((row: any) => {
          const config = DIMENSION_CONFIGS[row.dimension_id as keyof typeof DIMENSION_CONFIGS]
          const subScales = typeof row.sub_scale_scores === 'string'
            ? JSON.parse(row.sub_scale_scores)
            : row.sub_scale_scores || {}

          return {
            dimensionId: row.dimension_id,
            dimensionName: config?.name || row.dimension_id,
            overallScore: row.overall_score || 3.0,
            subScaleScores: subScales,
            attachmentStyle: subScales.attachment_style || subScales.style,
            conflictApproach: subScales.conflict_approach || subScales.approach,
            loveLangProfile: subScales.love_lang_profile || subScales.loveLangProfile,
          }
        })
        setDimensions(dims)
      }

      // Check if report already purchased
      const { data: reportData } = await supabase
        .from('self_discovery_reports')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (reportData) {
        setReportPurchased(true)
      }

      setLoading(false)
    }

    fetchData()
  }, [user, supabase])

  // Computed values
  const attachmentDim = dimensions.find((d) => d.dimensionId === 'attachment')
  const commDim = dimensions.find((d) => d.dimensionId === 'communication')
  const eiDim = dimensions.find((d) => d.dimensionId === 'emotional_intelligence')
  const valuesDim = dimensions.find((d) => d.dimensionId === 'values')
  const loveLangDim = dimensions.find((d) => d.dimensionId === 'love_languages')

  const attachmentStyle = attachmentDim?.attachmentStyle || 'secure'
  const conflictApproach = commDim?.conflictApproach || 'collaborator'

  // EQ breakdown
  const eqBreakdown = useMemo(() => ({
    'Self-Awareness': eiDim?.subScaleScores?.self_awareness || 3.0,
    'Self-Regulation': eiDim?.subScaleScores?.emotional_regulation || 3.0,
    'Empathy': eiDim?.subScaleScores?.empathy || 3.0,
    'Social Skills': ((eiDim?.subScaleScores?.empathy || 3.0) + (eiDim?.subScaleScores?.self_awareness || 3.0)) / 2,
  }), [eiDim])

  // Love language ranking
  const loveLanguageRanking = useMemo(() => {
    const allLangs = ['words_of_affirmation', 'acts_of_service', 'receiving_gifts', 'quality_time', 'physical_touch']
    const tally = loveLangDim?.loveLangProfile?.receivingTally || {}
    const total = Object.values(tally).reduce((sum: number, v: number) => sum + v, 0) || 1

    return allLangs
      .map((lang) => ({
        key: lang,
        label: LOVE_LANGUAGE_LABELS[lang] || lang,
        percentage: Math.round(((tally[lang] || 0) / total) * 100) || 20,
      }))
      .sort((a, b) => b.percentage - a.percentage)
  }, [loveLangDim])

  // Dating readiness score
  const datingReadinessScore = useMemo(() => {
    if (dimensions.length === 0) return 0
    const weights: Record<string, number> = {
      values: 0.12, attachment: 0.28, communication: 0.20,
      emotional_intelligence: 0.22, lifestyle_ambition: 0.08, love_languages: 0.10,
    }
    let total = 0, totalWeight = 0
    for (const dim of dimensions) {
      const w = weights[dim.dimensionId] || 0.1
      total += (dim.overallScore / 5) * 100 * w
      totalWeight += w
    }
    return totalWeight > 0 ? Math.round(total / totalWeight) : 50
  }, [dimensions])

  // Top traits for CIQ Card
  const topTraits = useMemo(() => {
    const traits: string[] = []
    if (attachmentStyle === 'secure' || attachmentStyle === 'earned_secure') traits.push('Emotionally Grounded')
    else if (attachmentStyle === 'anxious_preoccupied') traits.push('Deeply Connected')
    else if (attachmentStyle === 'dismissive_avoidant') traits.push('Self-Reliant')
    else traits.push('Emotionally Complex')

    if (eiDim && eiDim.overallScore >= 3.8) traits.push('High EQ')
    else traits.push('Self-Aware')

    const relPriority = valuesDim?.subScaleScores?.relationship_priority || 3.0
    if (relPriority >= 4.0) traits.push('Relationship-Focused')
    else traits.push('Balanced')

    return traits.slice(0, 3)
  }, [attachmentStyle, eiDim, valuesDim])

  // Purchase report handler
  const handlePurchaseReport = async () => {
    setPurchasingReport(true)
    try {
      const res = await fetch('/api/reports/self-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.reportId) {
        setReportPurchased(true)
        router.push(`/app/self-discovery/report`)
      }
    } catch (err) {
      console.error('Failed to purchase report:', err)
    } finally {
      setPurchasingReport(false)
    }
  }

  // Switch to dating mode
  const handleSwitchToDating = async () => {
    try {
      await fetch('/api/profile/mode', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'dating' }),
      })
      router.push('/app/onboarding')
    } catch (err) {
      console.error('Failed to switch mode:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (dimensions.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <Brain className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ciq-green)' }} />
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Complete Your Assessments
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Take all 6 assessments to see your Personal Compatibility Profile.
        </p>
        <button
          onClick={() => router.push('/app/assessment')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--ciq-purple)' }}
        >
          Go to Assessments <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Your Compatibility Profile
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {profile?.firstName}, here is what your assessments reveal about you.
        </p>
      </div>

      {/* Dimension Score Rings */}
      <div className="grid grid-cols-3 gap-4">
        {dimensions.map((dim) => {
          const normalized = Math.round((dim.overallScore / 5) * 100)
          const color = DIMENSION_COLORS[dim.dimensionId] || '#7B68B5'
          const circumference = 2 * Math.PI * 36

          return (
            <div key={dim.dimensionId} className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="var(--border)" strokeWidth="5" />
                  <circle
                    cx="40" cy="40" r="36" fill="none"
                    stroke={color} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${(normalized / 100) * circumference} ${circumference}`}
                    transform="rotate(-90 40 40)"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{normalized}</span>
                </div>
              </div>
              <p className="text-[10px] font-medium text-center mt-1.5 leading-tight" style={{ color: 'var(--text-secondary)' }}>
                {dim.dimensionName}
              </p>
            </div>
          )
        })}
      </div>

      {/* Attachment Style Card */}
      <SectionCard title="Attachment Style" icon={Heart} color="#5B8DB8">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
            style={{ background: '#5B8DB8' }}
          >
            {ATTACHMENT_LABELS[attachmentStyle] || attachmentStyle}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {ATTACHMENT_EXPLANATIONS[attachmentStyle] || ''}
        </p>
      </SectionCard>

      {/* Communication Profile Card */}
      <SectionCard title="Communication Profile" icon={MessageCircle} color="#D4A017">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
            style={{ background: '#D4A017' }}
          >
            {CONFLICT_LABELS[conflictApproach] || conflictApproach}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ciq-green)' }}>Strengths</p>
            <ul className="space-y-1">
              {(CONFLICT_STRENGTHS[conflictApproach] || []).map((s, i) => (
                <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  + {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ciq-coral)' }}>Watch For</p>
            <ul className="space-y-1">
              {(CONFLICT_WEAKNESSES[conflictApproach] || []).map((w, i) => (
                <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  - {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Emotional Intelligence Card */}
      <SectionCard title="Emotional Intelligence" icon={Brain} color="#E8735A">
        <div className="space-y-3">
          {Object.entries(eqBreakdown).map(([label, score]) => {
            const percentage = Math.round((score / 5) * 100)
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
                  <span className="text-xs font-bold" style={{ color: '#E8735A' }}>{percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%`, background: '#E8735A' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Values Map - Radar Chart (SVG) */}
      <SectionCard title="Values Map" icon={Target} color="#7B68B5">
        <ValuesRadarChart
          lifeDirection={valuesDim?.subScaleScores?.life_direction || 3.0}
          moralEthical={valuesDim?.subScaleScores?.moral_ethical || 3.0}
          relationshipPriority={valuesDim?.subScaleScores?.relationship_priority || 3.0}
        />
      </SectionCard>

      {/* Love Languages */}
      <SectionCard title="Love Languages" icon={Heart} color="#C25B8A">
        <div className="space-y-3">
          {loveLanguageRanking.map((lang, i) => (
            <div key={lang.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {i === 0 && <span className="mr-1" style={{ color: '#C25B8A' }}>1.</span>}
                  {lang.label}
                </span>
                <span className="text-xs font-bold" style={{ color: '#C25B8A' }}>{lang.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${lang.percentage}%`,
                    background: i === 0 ? '#C25B8A' : i === 1 ? '#D47FA3' : '#E0A3BC',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Dating Readiness Score */}
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: 'var(--ciq-purple)', background: 'var(--bg-card)' }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Dating Readiness Score
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 96 96" className="w-full h-full">
              <circle cx="48" cy="48" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle
                cx="48" cy="48" r="42" fill="none"
                stroke="var(--ciq-purple)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${(datingReadinessScore / 100) * 263.9} 263.9`}
                transform="rotate(-90 48 48)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: 'var(--ciq-purple)' }}>{datingReadinessScore}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {datingReadinessScore >= 80 ? 'Highly Ready' :
               datingReadinessScore >= 60 ? 'Solid Foundation' :
               datingReadinessScore >= 40 ? 'Developing' : 'Growth Phase'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {datingReadinessScore >= 80
                ? 'Your profile shows strong readiness for a healthy relationship.'
                : datingReadinessScore >= 60
                  ? 'You have a solid base. Focus on your growth edges for best results.'
                  : 'Investing in personal development will pay dividends in your next relationship.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Teaser: Compatible people in your city */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'linear-gradient(135deg, var(--ciq-purple-light) 0%, #F0FDF9 100%)' }}
      >
        <Users className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--ciq-purple)' }} />
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          {Math.floor(Math.random() * 40) + 12} people in {profile?.locationCity || 'your area'} are compatible with your profile
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          Switch to dating mode to see your matches.
        </p>
        <button
          onClick={handleSwitchToDating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--ciq-purple)' }}
        >
          Switch to Dating <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Upsell: Full Report */}
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
      >
        <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {reportPurchased ? 'View Your Full Report' : 'Get Your Full Self-Discovery Report'}
        </h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          {reportPurchased
            ? 'Your detailed personal insight report is ready.'
            : 'A deep dive into your relationship patterns, growth edges, and dating readiness. Includes actionable insights for every dimension.'
          }
        </p>
        {reportPurchased ? (
          <button
            onClick={() => router.push('/app/self-discovery/report')}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--ciq-green)' }}
          >
            View Report
          </button>
        ) : (
          <button
            onClick={handlePurchaseReport}
            disabled={purchasingReport || dimensions.length < 6}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--ciq-purple)' }}
          >
            {purchasingReport ? 'Loading...' : 'Get Your Full Self-Discovery Report — $4.99'}
          </button>
        )}
        {dimensions.length < 6 && !reportPurchased && (
          <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
            Complete all 6 assessments to unlock
          </p>
        )}
      </div>

      {/* Share CIQ Card */}
      <div className="text-center">
        <button
          onClick={() => setShowCIQCard(!showCIQCard)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
            background: 'var(--bg-card)',
          }}
        >
          <Share2 className="w-4 h-4" />
          {showCIQCard ? 'Hide' : 'Share'} Your CIQ Card
          {showCIQCard ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {showCIQCard && (
        <CIQCard
          firstName={profile?.firstName || 'You'}
          topTraits={topTraits}
          attachmentStyleLabel={ATTACHMENT_LABELS[attachmentStyle] || 'Secure'}
          primaryLoveLanguage={loveLanguageRanking[0]?.label || 'Quality Time'}
          eqScore={Math.round((eiDim?.overallScore || 3.0) / 5 * 100)}
        />
      )}
    </div>
  )
}

// ─── Section Card Component ─────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string
  icon: typeof Brain
  color: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ─── Values Radar Chart (SVG) ───────────────────────────

function ValuesRadarChart({
  lifeDirection,
  moralEthical,
  relationshipPriority,
}: {
  lifeDirection: number
  moralEthical: number
  relationshipPriority: number
}) {
  // Normalize to 0-1 range (from 1-5 scale)
  const ld = (lifeDirection - 1) / 4
  const me = (moralEthical - 1) / 4
  const rp = (relationshipPriority - 1) / 4

  const cx = 120, cy = 100, r = 70

  // Three axes at 120 degrees apart
  const axes = [
    { label: 'Life Direction', angle: -90, value: ld },
    { label: 'Moral & Ethical', angle: 30, value: me },
    { label: 'Relationship Priority', angle: 150, value: rp },
  ]

  const points = axes.map((axis) => {
    const rad = (axis.angle * Math.PI) / 180
    const dist = axis.value * r
    return {
      x: cx + dist * Math.cos(rad),
      y: cy + dist * Math.sin(rad),
      labelX: cx + (r + 20) * Math.cos(rad),
      labelY: cy + (r + 20) * Math.sin(rad),
      label: axis.label,
      value: Math.round(axis.value * 100),
    }
  })

  const polygon = points.map((p) => `${p.x},${p.y}`).join(' ')

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0]

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 240 200" className="w-full max-w-[280px]">
        {/* Grid rings */}
        {rings.map((ring) => {
          const ringPoints = axes.map((axis) => {
            const rad = (axis.angle * Math.PI) / 180
            const dist = ring * r
            return `${cx + dist * Math.cos(rad)},${cy + dist * Math.sin(rad)}`
          })
          return (
            <polygon
              key={ring}
              points={ringPoints.join(' ')}
              fill="none"
              stroke="var(--border)"
              strokeWidth="0.5"
              opacity={0.5}
            />
          )
        })}

        {/* Axis lines */}
        {axes.map((axis, i) => {
          const rad = (axis.angle * Math.PI) / 180
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={cx + r * Math.cos(rad)}
              y2={cy + r * Math.sin(rad)}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          )
        })}

        {/* Data polygon */}
        <polygon
          points={polygon}
          fill="rgba(123,104,181,0.2)"
          stroke="#7B68B5"
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#7B68B5" />
        ))}

        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] font-medium"
            fill="var(--text-secondary)"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
