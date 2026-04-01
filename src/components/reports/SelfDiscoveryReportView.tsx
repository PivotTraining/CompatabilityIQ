'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import CIQCard from '@/components/cards/CIQCard'
import {
  Download,
  Share2,
  Brain,
  Heart,
  MessageCircle,
  Target,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Users,
  ArrowLeft,
  Check,
  Shield,
  Zap,
  Star,
  ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { SelfDiscoveryReport, ReportSection } from '@/lib/reports/self-discovery-report'

// ─── Section Config ────────────────────────────────────

interface SectionMeta {
  icon: typeof Brain
  color: string
  gradient: string
}

const SECTION_META: Record<string, SectionMeta> = {
  whoYouAre: {
    icon: Target,
    color: '#7B68B5',
    gradient: 'linear-gradient(135deg, #7B68B5 0%, #9B8DD0 100%)',
  },
  howYouAttach: {
    icon: Heart,
    color: '#5B8DB8',
    gradient: 'linear-gradient(135deg, #5B8DB8 0%, #7BAFD4 100%)',
  },
  howYouFight: {
    icon: MessageCircle,
    color: '#D4A017',
    gradient: 'linear-gradient(135deg, #D4A017 0%, #E8B84A 100%)',
  },
  yourEmotionalRange: {
    icon: Brain,
    color: '#E8735A',
    gradient: 'linear-gradient(135deg, #E8735A 0%, #F09680 100%)',
  },
  whatYouNeed: {
    icon: Heart,
    color: '#C25B8A',
    gradient: 'linear-gradient(135deg, #C25B8A 0%, #D87FAA 100%)',
  },
  growthEdges: {
    icon: AlertCircle,
    color: '#E8735A',
    gradient: 'linear-gradient(135deg, #E8735A 0%, #D94E33 100%)',
  },
  datingReadiness: {
    icon: TrendingUp,
    color: '#4CAF8A',
    gradient: 'linear-gradient(135deg, #4CAF8A 0%, #6BC4A6 100%)',
  },
}

const SECTION_ORDER = [
  'whoYouAre',
  'howYouAttach',
  'howYouFight',
  'yourEmotionalRange',
  'whatYouNeed',
  'growthEdges',
  'datingReadiness',
]

const DIMENSION_COLORS: Record<string, string> = {
  values: '#7B68B5',
  attachment: '#5B8DB8',
  communication: '#D4A017',
  emotional_intelligence: '#E8735A',
  lifestyle_ambition: '#4CAF8A',
  how_you_love: '#C25B8A',
}

const DIMENSION_ICONS: Record<string, typeof Brain> = {
  values: Target,
  attachment: Heart,
  communication: MessageCircle,
  emotional_intelligence: Brain,
  lifestyle_ambition: TrendingUp,
  how_you_love: Sparkles,
}

const EQ_LABELS: Record<string, string> = {
  self_awareness: 'Self-Awareness',
  self_regulation: 'Self-Regulation',
  empathy: 'Empathy',
  social_skills: 'Social Skills',
}

// ─── Animated Score Ring ───────────────────────────────

function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  color = '#7B68B5',
  label,
  sublabel,
}: {
  score: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold"
            style={{
              color,
              fontSize: size > 100 ? '2rem' : '1.25rem',
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          {sublabel && (
            <span
              className="text-[10px] font-medium mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <p
          className="text-xs font-semibold mt-2 text-center"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </p>
      )}
    </div>
  )
}

// ─── Horizontal Bar ────────────────────────────────────

function HorizontalBar({
  label,
  percentage,
  color,
  showValue = true,
}: {
  label: string
  percentage: number
  color: string
  showValue?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
        {showValue && (
          <span className="text-xs font-bold" style={{ color }}>
            {percentage}%
          </span>
        )}
      </div>
      <div
        className="h-2.5 rounded-full overflow-hidden"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(percentage, 3)}%`,
            background: `linear-gradient(90deg, ${color}, ${color}CC)`,
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  )
}

// ─── Section Wrapper ───────────────────────────────────

function ReportSectionCard({
  sectionKey,
  section,
  children,
}: {
  sectionKey: string
  section: ReportSection
  children?: React.ReactNode
}) {
  const meta = SECTION_META[sectionKey] || { icon: Brain, color: '#7B68B5', gradient: '' }
  const Icon = meta.icon
  const isGrowthEdges = sectionKey === 'growthEdges'

  return (
    <div
      id={`section-${sectionKey}`}
      className="rounded-2xl border overflow-hidden print:break-inside-avoid"
      style={{
        borderColor: isGrowthEdges ? 'rgba(232, 115, 90, 0.3)' : 'var(--border)',
        background: 'var(--bg-card)',
      }}
    >
      {/* Section Header with gradient accent */}
      <div
        className="px-6 pt-6 pb-4"
        style={{
          borderBottom: `1px solid ${isGrowthEdges ? 'rgba(232, 115, 90, 0.15)' : 'var(--border)'}`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: meta.gradient }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3
            className="text-lg font-bold"
            style={{ color: isGrowthEdges ? meta.color : 'var(--text-primary)' }}
          >
            {section.title}
          </h3>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}
        >
          {section.narrative}
        </p>
      </div>

      {/* Highlights */}
      {section.highlights.length > 0 && (
        <div className="px-6 py-4 space-y-3">
          {section.highlights.map((highlight, i) => (
            <div
              key={i}
              className="flex items-start gap-3"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: isGrowthEdges ? 'rgba(232, 115, 90, 0.12)' : `${meta.color}15`,
                }}
              >
                {isGrowthEdges ? (
                  <ChevronRight className="w-3 h-3" style={{ color: meta.color }} />
                ) : (
                  <Check className="w-3 h-3" style={{ color: meta.color }} />
                )}
              </div>
              <span
                className="text-sm"
                style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}
              >
                {highlight}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Extra content (charts, visualizations, etc.) */}
      {children && <div className="px-6 pb-6">{children}</div>}
    </div>
  )
}

// ─── Main Report Component ─────────────────────────────

export default function SelfDiscoveryReportView() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const reportRef = useRef<HTMLDivElement>(null)
  const [report, setReport] = useState<SelfDiscoveryReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user || !supabase) return

    supabase
      .from('self_discovery_reports')
      .select('report_data')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          const reportData =
            typeof data.report_data === 'string'
              ? JSON.parse(data.report_data)
              : data.report_data
          setReport(reportData as SelfDiscoveryReport)
        }
        setLoading(false)
      })
  }, [user, supabase])

  // Save as image (full report)
  const handleSaveImage = useCallback(async () => {
    if (!reportRef.current) return
    setExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#0A0A0B',
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
        windowHeight: reportRef.current.scrollHeight,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${report?.firstName || 'My'}-Self-Discovery-Report.png`
      link.href = dataUrl
      link.click()
    } catch {
      // Fallback to print
      window.print()
    } finally {
      setExporting(false)
    }
  }, [report?.firstName])

  // Share
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${report?.firstName}'s Self-Discovery Report`,
          text: 'Check out my CompatibleIQ compatibility profile!',
          url: window.location.href,
        })
        return
      } catch {
        // user cancelled or not supported
      }
    }
    // Fallback: copy URL
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report?.firstName])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div
          className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          Loading your report...
        </p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #7B68B5 0%, #9B8DD0 100%)' }}
        >
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Report Not Found
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Purchase your Self-Discovery Report to unlock your detailed compatibility profile.
        </p>
        <button
          onClick={() => router.push('/app/self-discovery')}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--ciq-purple)' }}
        >
          Go to Self-Discovery
        </button>
      </div>
    )
  }

  const readinessColor =
    report.datingReadinessScore >= 80
      ? '#4CAF8A'
      : report.datingReadinessScore >= 60
        ? '#5B8DB8'
        : report.datingReadinessScore >= 40
          ? '#D4A017'
          : '#E8735A'

  const readinessTier =
    report.datingReadinessScore >= 80
      ? 'Highly Ready'
      : report.datingReadinessScore >= 60
        ? 'Solid Foundation'
        : report.datingReadinessScore >= 40
          ? 'Developing'
          : 'Growth Phase'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 print:py-0">
      {/* Back Button (non-print) */}
      <button
        onClick={() => router.push('/app/self-discovery')}
        className="flex items-center gap-2 text-sm font-medium mb-6 print:hidden"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Self-Discovery
      </button>

      <div ref={reportRef} className="space-y-6 print:space-y-8">
        {/* ═══════ Hero Header ═══════ */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #7B68B5 0%, #5A4A99 40%, #3D2D6B 100%)',
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.07]"
            style={{ background: 'white' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full opacity-[0.05]"
            style={{ background: 'white' }}
          />
          <div
            className="absolute top-12 left-8 w-2 h-2 rounded-full opacity-20"
            style={{ background: 'white' }}
          />
          <div
            className="absolute bottom-16 right-12 w-3 h-3 rounded-full opacity-15"
            style={{ background: 'white' }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 bg-white/10 text-white/80">
              <Shield className="w-3.5 h-3.5" />
              Premium Self-Discovery Report
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {report.firstName}&apos;s Compatibility Profile
            </h1>

            <p className="text-white/50 text-sm mb-6">
              Generated {new Date(report.generatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            {/* Top 3 Trait Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {report.topTraits.map((trait, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* Quick Stats Row */}
            <div
              className="grid grid-cols-3 gap-4 p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <div>
                <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Attachment
                </p>
                <p className="text-white text-sm font-bold">
                  {report.attachmentStyleLabel}
                </p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Conflict Style
                </p>
                <p className="text-white text-sm font-bold">
                  {report.dominantConflictStyleLabel}
                </p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Love Style
                </p>
                <p className="text-white text-sm font-bold">
                  {report.loveLanguageRanking[0]?.label || 'Balanced'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ Dating Readiness Score ═══════ */}
        <div
          className="rounded-2xl border p-8 print:break-inside-avoid"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing
              score={report.datingReadinessScore}
              size={140}
              strokeWidth={10}
              color={readinessColor}
              sublabel="/ 100"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: `${readinessColor}18`,
                    color: readinessColor,
                  }}
                >
                  {readinessTier}
                </span>
              </div>
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Dating Readiness Score
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}
              >
                {report.datingReadinessNarrative}
              </p>
            </div>
          </div>
        </div>

        {/* ═══════ Dimension Overview Grid ═══════ */}
        <div>
          <h2
            className="text-lg font-bold mb-4 px-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Your 6-Dimension Profile
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {report.dimensionSummaries.map((dim) => {
              const color = DIMENSION_COLORS[dim.dimensionId] || '#7B68B5'
              const Icon = DIMENSION_ICONS[dim.dimensionId] || Brain

              return (
                <div
                  key={dim.dimensionId}
                  className="rounded-2xl border p-4 flex flex-col items-center text-center"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${color}15` }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <p
                    className="text-2xl font-bold mb-0.5"
                    style={{ color }}
                  >
                    {dim.score}
                  </p>
                  <p
                    className="text-[11px] font-medium leading-tight mb-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {dim.dimensionName}
                  </p>
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{
                      background:
                        dim.score >= 80
                          ? '#DCFCE7'
                          : dim.score >= 60
                            ? '#DBEAFE'
                            : dim.score >= 40
                              ? '#FEF9C3'
                              : '#FEE2E2',
                      color:
                        dim.score >= 80
                          ? '#16A34A'
                          : dim.score >= 60
                            ? '#2563EB'
                            : dim.score >= 40
                              ? '#A16207'
                              : '#DC2626',
                    }}
                  >
                    {dim.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ═══════ Section: Who You Are ═══════ */}
        <ReportSectionCard
          sectionKey="whoYouAre"
          section={report.sections.whoYouAre}
        >
          {/* Values Profile Bars */}
          {Object.keys(report.valuesProfile).length > 0 && (
            <div className="space-y-3 mt-2">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Your Values Profile
              </p>
              {Object.entries(report.valuesProfile).map(([key, value]) => {
                const labels: Record<string, string> = {
                  life_direction: 'Life Direction',
                  moral_ethical: 'Moral & Ethical',
                  relationship_priority: 'Relationship Priority',
                }
                return (
                  <HorizontalBar
                    key={key}
                    label={labels[key] || key}
                    percentage={Math.round((value / 5) * 100)}
                    color="#7B68B5"
                  />
                )
              })}
            </div>
          )}
        </ReportSectionCard>

        {/* ═══════ Section: How You Attach ═══════ */}
        <ReportSectionCard
          sectionKey="howYouAttach"
          section={report.sections.howYouAttach}
        >
          {/* Attachment Style Card */}
          <div
            className="rounded-xl p-5 mt-2"
            style={{
              background: 'linear-gradient(135deg, rgba(91, 141, 184, 0.08) 0%, rgba(91, 141, 184, 0.03) 100%)',
              border: '1px solid rgba(91, 141, 184, 0.15)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5B8DB8 0%, #7BAFD4 100%)' }}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Your Attachment Style
                </p>
                <p className="text-base font-bold" style={{ color: '#5B8DB8' }}>
                  {report.attachmentStyleLabel}
                </p>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              <p
                className="text-xs font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                What this means for your relationships:
              </p>
              <ul className="space-y-1.5">
                {report.attachmentStyleLabel === 'Secure' || report.attachmentStyleLabel === 'Earned Secure' ? (
                  <>
                    <RelationshipImplication text="You can tolerate uncertainty without panic or withdrawal" color="#5B8DB8" />
                    <RelationshipImplication text="Partners feel safe to be vulnerable around you" color="#5B8DB8" />
                    <RelationshipImplication text="You naturally balance closeness and autonomy" color="#5B8DB8" />
                    <RelationshipImplication text="Best matched with any style -- you stabilize insecure partners" color="#5B8DB8" />
                  </>
                ) : report.attachmentStyleLabel === 'Anxious-Preoccupied' ? (
                  <>
                    <RelationshipImplication text="You may over-function in relationships to reduce anxiety" color="#5B8DB8" />
                    <RelationshipImplication text="Early dating ambiguity is especially hard for you" color="#5B8DB8" />
                    <RelationshipImplication text="You bring high emotional investment and availability" color="#5B8DB8" />
                    <RelationshipImplication text="Best matched with secure or earned-secure partners" color="#5B8DB8" />
                  </>
                ) : report.attachmentStyleLabel === 'Dismissive-Avoidant' ? (
                  <>
                    <RelationshipImplication text="You may pull away when closeness feels like pressure" color="#5B8DB8" />
                    <RelationshipImplication text="You value space and can interpret need as neediness" color="#5B8DB8" />
                    <RelationshipImplication text="You bring groundedness and emotional stability" color="#5B8DB8" />
                    <RelationshipImplication text="Best matched with secure partners who respect autonomy" color="#5B8DB8" />
                  </>
                ) : (
                  <>
                    <RelationshipImplication text="You may cycle between wanting closeness and pulling back" color="#5B8DB8" />
                    <RelationshipImplication text="Consistency from a partner helps your nervous system settle" color="#5B8DB8" />
                    <RelationshipImplication text="You bring emotional depth and hard-won self-awareness" color="#5B8DB8" />
                    <RelationshipImplication text="Best matched with secure or earned-secure partners" color="#5B8DB8" />
                  </>
                )}
              </ul>
            </div>
          </div>
        </ReportSectionCard>

        {/* ═══════ Section: How You Fight ═══════ */}
        <ReportSectionCard
          sectionKey="howYouFight"
          section={report.sections.howYouFight}
        >
          {/* Conflict Style Card + Repair Strategies */}
          <div className="space-y-4 mt-2">
            <div
              className="rounded-xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.08) 0%, rgba(212, 160, 23, 0.03) 100%)',
                border: '1px solid rgba(212, 160, 23, 0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #D4A017 0%, #E8B84A 100%)' }}
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Your Conflict Style
                  </p>
                  <p className="text-base font-bold" style={{ color: '#D4A017' }}>
                    {report.dominantConflictStyleLabel}
                  </p>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <p
                  className="text-xs font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Conflict patterns to watch:
                </p>
                <ul className="space-y-1.5">
                  {getConflictPatterns(report.dominantConflictStyle).map((pattern, i) => (
                    <RelationshipImplication key={i} text={pattern} color="#D4A017" />
                  ))}
                </ul>
              </div>
            </div>

            {/* Repair Strategies */}
            <div
              className="rounded-xl p-5"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4" style={{ color: '#4CAF8A' }} />
                <p
                  className="text-sm font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Repair Strategies for Your Style
                </p>
              </div>
              <ul className="space-y-2">
                {getRepairStrategies(report.dominantConflictStyle).map((strategy, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span
                      className="text-xs font-bold flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{
                        background: 'rgba(76, 175, 138, 0.12)',
                        color: '#4CAF8A',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ lineHeight: '1.5' }}>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ReportSectionCard>

        {/* ═══════ Section: Emotional Range ═══════ */}
        <ReportSectionCard
          sectionKey="yourEmotionalRange"
          section={report.sections.yourEmotionalRange}
        >
          {/* EQ Breakdown Bars */}
          <div className="space-y-3 mt-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Emotional Intelligence Breakdown
            </p>
            {Object.entries(report.eqBreakdown).map(([key, value]) => (
              <HorizontalBar
                key={key}
                label={EQ_LABELS[key] || key}
                percentage={Math.round((value / 5) * 100)}
                color="#E8735A"
              />
            ))}
          </div>
        </ReportSectionCard>

        {/* ═══════ Section: What You Need (Love Styles) ═══════ */}
        <ReportSectionCard
          sectionKey="whatYouNeed"
          section={report.sections.whatYouNeed}
        >
          {/* Love Language Ranking */}
          <div className="space-y-3 mt-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Your Love Style Profile
            </p>
            {report.loveLanguageRanking.map((lang, i) => (
              <div key={lang.language} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <Star className="w-3.5 h-3.5" style={{ color: '#C25B8A' }} />
                    )}
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: i === 0 ? '#C25B8A' : 'var(--text-primary)',
                        fontWeight: i === 0 ? 700 : 500,
                      }}
                    >
                      {lang.label}
                      {i === 0 && ' (Primary)'}
                      {i === 1 && lang.percentage > 10 && ' (Secondary)'}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: i === 0 ? '#C25B8A' : 'var(--text-muted)' }}
                  >
                    {lang.percentage}%
                  </span>
                </div>
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(lang.percentage, 3)}%`,
                      background:
                        i === 0
                          ? 'linear-gradient(90deg, #C25B8A, #D87FAA)'
                          : i === 1
                            ? 'linear-gradient(90deg, #C25B8A99, #D87FAA99)'
                            : 'var(--text-muted)',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ReportSectionCard>

        {/* ═══════ Section: Growth Edges ═══════ */}
        <ReportSectionCard
          sectionKey="growthEdges"
          section={report.sections.growthEdges}
        />

        {/* ═══════ Section: Dating Readiness ═══════ */}
        <ReportSectionCard
          sectionKey="datingReadiness"
          section={report.sections.datingReadiness}
        >
          {/* Dimension contribution bars */}
          <div className="space-y-3 mt-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Readiness by Dimension
            </p>
            {report.dimensionSummaries.map((dim) => {
              const color = DIMENSION_COLORS[dim.dimensionId] || '#7B68B5'
              return (
                <HorizontalBar
                  key={dim.dimensionId}
                  label={dim.dimensionName}
                  percentage={dim.score}
                  color={color}
                />
              )
            })}
          </div>
        </ReportSectionCard>

        {/* ═══════ Relationship Readiness Assessment ═══════ */}
        <div
          className="rounded-2xl border overflow-hidden print:break-inside-avoid"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
        >
          <div
            className="p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(76, 175, 138, 0.06) 0%, rgba(76, 175, 138, 0.02) 100%)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: '#4CAF8A' }} />
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Overall Relationship Readiness
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <ReadinessIndicator
                label="Self-Awareness"
                score={getAwarenessScore(report)}
                description="How well you know your own patterns"
              />
              <ReadinessIndicator
                label="Emotional Capacity"
                score={getEmotionalCapacity(report)}
                description="Your ability to hold space for two"
              />
              <ReadinessIndicator
                label="Growth Orientation"
                score={getGrowthOrientation(report)}
                description="Your willingness to evolve"
              />
            </div>

            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}
            >
              {getReadinessNarrative(report)}
            </p>
          </div>
        </div>

        {/* ═══════ Shareable CIQ Card ═══════ */}
        <div className="pt-4 print:hidden">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Your Shareable CIQ Card
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Share your compatibility profile on social media
            </p>
          </div>
          <CIQCard
            firstName={report.firstName}
            topTraits={report.topTraits}
            attachmentStyleLabel={report.attachmentStyleLabel}
            primaryLoveLanguage={report.loveLanguageRanking[0]?.label || 'Quality Time'}
            eqScore={Math.round(
              (Object.values(report.eqBreakdown).reduce((sum, v) => sum + v, 0) /
                Object.values(report.eqBreakdown).length /
                5) *
                100
            )}
          />
        </div>

        {/* ═══════ Report Footer ═══════ */}
        <div
          className="rounded-2xl border p-6 text-center print:break-inside-avoid"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
        >
          <p
            className="text-xs leading-relaxed mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            This report is based on your responses to the CompatibleIQ 6-dimension assessment battery.
            It reflects patterns, not permanence. People grow and change -- use this as a starting point for self-awareness, not a fixed label.
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Report ID: {report.id}
          </p>
        </div>
      </div>

      {/* ═══════ Floating Action Bar ═══════ */}
      <div className="sticky bottom-4 mt-8 print:hidden">
        <div
          className="flex items-center justify-center gap-3 p-3 rounded-2xl mx-auto max-w-sm"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <button
            onClick={handleSaveImage}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex-1 justify-center"
            style={{ background: 'var(--ciq-purple)', color: 'white' }}
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Saving...' : 'Save Report'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-90"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              background: 'var(--bg-secondary)',
            }}
          >
            Print
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-90"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              background: 'var(--bg-secondary)',
            }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" style={{ color: 'var(--ciq-green)' }} />
                Copied
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Small Helper Components ───────────────────────────

function RelationshipImplication({ text, color }: { text: string; color: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
        style={{ background: color }}
      />
      <span style={{ lineHeight: '1.5' }}>{text}</span>
    </li>
  )
}

function ReadinessIndicator({
  label,
  score,
  description,
}: {
  label: string
  score: number
  description: string
}) {
  const color =
    score >= 80 ? '#4CAF8A' : score >= 60 ? '#5B8DB8' : score >= 40 ? '#D4A017' : '#E8735A'

  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
      }}
    >
      <ScoreRing score={score} size={64} strokeWidth={5} color={color} />
      <p className="text-xs font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
        {label}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>
    </div>
  )
}

// ─── Content Generators ────────────────────────────────

function getConflictPatterns(style: string): string[] {
  const patterns: Record<string, string[]> = {
    confronter: [
      'You may escalate before the other person is ready to engage',
      'Intensity can feel like aggression to conflict-avoidant partners',
      'You process externally -- you need to talk it out to understand it',
      'Under stress, directness can override empathy',
    ],
    avoider: [
      'Unaddressed issues accumulate into resentment over time',
      'Your silence may be misread as not caring by your partner',
      'You may agree to things you do not actually agree with to end conflict',
      'Physical withdrawal is your nervous system protecting you, not punishing',
    ],
    collaborator: [
      'You may over-process issues that would resolve naturally',
      'Your fairness instinct can delay decisions that need to be made quickly',
      'Partners may feel managed rather than met when you default to problem-solving',
      'Your collaborative style is a genuine strength -- protect it under stress',
    ],
    accommodator: [
      'You may suppress your needs until they surface as resentment',
      'Partners may not know what you actually want or need',
      'Your flexibility can be mistaken for not having preferences',
      'Under stress, you may withdraw rather than accommodate',
    ],
    unclassified: [
      'You adapt your approach based on the situation -- this is flexible but unpredictable',
      'Partners may struggle to anticipate how you will respond to conflict',
      'Under stress, you may not have a reliable default to fall back on',
      'Building a conscious preference for collaboration gives you a home base',
    ],
  }
  return patterns[style] || patterns.unclassified
}

function getRepairStrategies(style: string): string[] {
  const strategies: Record<string, string[]> = {
    confronter: [
      'Lead with "I feel..." instead of "You always..." -- it keeps the door open',
      'Ask "Is now a good time?" before starting a difficult conversation',
      'After a disagreement, circle back and acknowledge what you heard from them',
      'Practice the 24-hour rule: if it still bothers you tomorrow, bring it up then',
    ],
    avoider: [
      'Use writing (text, letter) when face-to-face feels too activating',
      'Tell your partner "I need time but I will come back to this" -- and mean it',
      'Set a timer for 30 minutes of space, then re-engage -- do not let it go indefinitely',
      'Practice naming one feeling per day out loud to build the muscle for harder conversations',
    ],
    collaborator: [
      'Sometimes your partner just needs to be heard, not solved -- ask which one they need',
      'After repair, check in 24 hours later to make sure nothing was left unsaid',
      'When the solution is not obvious, say "I do not have the answer yet but I am with you"',
      'Let small things go -- not everything requires a processing conversation',
    ],
    accommodator: [
      'Before agreeing, pause and ask yourself what you actually want',
      'Use the phrase "Let me think about that" to buy time for your own needs to surface',
      'Practice one small disagreement per week in low-stakes situations',
      'After conflict, journal about what you did not say -- then consider saying it',
    ],
    unclassified: [
      'Develop a go-to opener for hard conversations: "I noticed something I want to talk about"',
      'After conflict, ask your partner "How are we?" to signal your commitment to repair',
      'Study the collaborator style and practice it intentionally as your default',
      'When you notice yourself shifting styles, pause and name what you are feeling',
    ],
  }
  return strategies[style] || strategies.unclassified
}

function getAwarenessScore(report: SelfDiscoveryReport): number {
  const eqAwareness = (report.eqBreakdown.self_awareness || 3) / 5
  const hasSecure =
    report.attachmentStyle === 'secure' || report.attachmentStyle === 'earned_secure'
  const attachmentBonus = hasSecure ? 0.1 : 0
  return Math.min(100, Math.round((eqAwareness + attachmentBonus) * 100))
}

function getEmotionalCapacity(report: SelfDiscoveryReport): number {
  const empathy = (report.eqBreakdown.empathy || 3) / 5
  const regulation = (report.eqBreakdown.self_regulation || 3) / 5
  return Math.round(((empathy + regulation) / 2) * 100)
}

function getGrowthOrientation(report: SelfDiscoveryReport): number {
  // Growth orientation is high when someone has lower scores but high self-awareness
  // Or simply high across the board
  const awareness = (report.eqBreakdown.self_awareness || 3) / 5
  const overall = report.datingReadinessScore / 100
  // If awareness is high relative to overall, growth orientation is very high
  const growthSignal = awareness > overall ? 0.15 : 0
  return Math.min(100, Math.round((awareness * 0.6 + overall * 0.4 + growthSignal) * 100))
}

function getReadinessNarrative(report: SelfDiscoveryReport): string {
  const score = report.datingReadinessScore
  const name = report.firstName

  if (score >= 80) {
    return `${name}, your profile shows a rare combination of self-awareness, emotional regulation, and relational skill. You understand your attachment patterns, you know how to navigate conflict, and you have a clear sense of what you need from a partner. You are not just ready to date -- you are ready to build something meaningful. The person who matches with you will be getting someone who has done the inner work.`
  }
  if (score >= 60) {
    return `${name}, you have a strong foundation for relationships. Your self-awareness is a real asset, and you have clear strengths to build on. The growth areas identified in this report are not obstacles -- they are opportunities. The fact that you took this assessment and are reading this report puts you ahead of most people in the dating pool. Stay conscious of your patterns, and you will continue to grow.`
  }
  if (score >= 40) {
    return `${name}, your profile shows genuine potential alongside some areas that would benefit from focused attention. Consider this report a roadmap: the dimensions where you scored lower are not permanent traits -- they are skills that respond to practice. Many people find that working on one area (especially emotional intelligence or attachment security) creates a ripple effect across the others.`
  }
  return `${name}, this assessment suggests that investing in personal growth right now will pay significant dividends in your future relationships. The patterns identified here are not fixed -- they are starting points. Consider working with a therapist or coach on the areas highlighted in your growth edges section. The self-awareness you have demonstrated by completing this assessment is itself a powerful first step.`
}
