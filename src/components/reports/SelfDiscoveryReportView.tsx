'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import CIQCard from '@/components/cards/CIQCard'
import {
  ChevronDown,
  ChevronUp,
  Printer,
  Share2,
  Brain,
  Heart,
  MessageCircle,
  Target,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

import type { SelfDiscoveryReport, ReportSection } from '@/lib/reports/self-discovery-report'

// ─── Section Icons ──────────────────────────────────────

const SECTION_META: Record<string, { icon: typeof Brain; color: string }> = {
  whoYouAre: { icon: Target, color: '#7B68B5' },
  howYouAttach: { icon: Heart, color: '#5B8DB8' },
  howYouFight: { icon: MessageCircle, color: '#D4A017' },
  yourEmotionalRange: { icon: Brain, color: '#E8735A' },
  whatYouNeed: { icon: Heart, color: '#C25B8A' },
  growthEdges: { icon: AlertCircle, color: '#E8735A' },
  datingReadiness: { icon: TrendingUp, color: '#4CAF8A' },
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

// ─── Component ──────────────────────────────────────────

export default function SelfDiscoveryReportView() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const [report, setReport] = useState<SelfDiscoveryReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['whoYouAre']))

  useEffect(() => {
    if (!user || !supabase) return

    supabase
      .from('self_discovery_reports')
      .select('report_data')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          const reportData = typeof data.report_data === 'string'
            ? JSON.parse(data.report_data)
            : data.report_data
          setReport(reportData as SelfDiscoveryReport)
        }
        setLoading(false)
      })
  }, [user, supabase])

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handlePrint = () => window.print()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <Brain className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Report Not Found
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Purchase your Self-Discovery Report to see your detailed breakdown.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6 print:space-y-8">
      {/* Header */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{ background: '#E8F5E9', color: 'var(--ciq-green)' }}
        >
          <Brain className="w-3 h-3" /> Self-Discovery Report
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {report.firstName}&apos;s Compatibility Profile
        </h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Generated {new Date(report.generatedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
        >
          <Printer className="w-3.5 h-3.5" /> Print
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: `${report.firstName}'s CIQ Profile`, url: window.location.href })
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      {/* Dating Readiness Score */}
      <div
        className="rounded-2xl border p-6 text-center"
        style={{ borderColor: 'var(--ciq-purple)', background: 'var(--bg-card)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ciq-purple)' }}>
          Dating Readiness Score
        </p>
        <div className="relative w-28 h-28 mx-auto mb-3">
          <svg viewBox="0 0 112 112" className="w-full h-full">
            <circle cx="56" cy="56" r="48" fill="none" stroke="var(--border)" strokeWidth="7" />
            <circle
              cx="56" cy="56" r="48" fill="none"
              stroke="var(--ciq-purple)" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={`${(report.datingReadinessScore / 100) * 301.6} 301.6`}
              transform="rotate(-90 56 56)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: 'var(--ciq-purple)' }}>
              {report.datingReadinessScore}
            </span>
          </div>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {report.datingReadinessNarrative.slice(0, 200)}
          {report.datingReadinessNarrative.length > 200 ? '...' : ''}
        </p>
      </div>

      {/* Dimension Summaries */}
      <div className="grid grid-cols-3 gap-3">
        {report.dimensionSummaries.map((dim) => (
          <div
            key={dim.dimensionId}
            className="rounded-xl border p-3 text-center"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
          >
            <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--ciq-purple)' }}>{dim.score}</p>
            <p className="text-[9px] font-medium leading-tight" style={{ color: 'var(--text-secondary)' }}>
              {dim.dimensionName}
            </p>
            <span
              className="inline-block px-1.5 py-0.5 rounded-full text-[8px] font-bold mt-1"
              style={{
                background: dim.score >= 80 ? '#DCFCE7' : dim.score >= 60 ? '#DBEAFE' : dim.score >= 40 ? '#FEF9C3' : '#FEE2E2',
                color: dim.score >= 80 ? '#16A34A' : dim.score >= 60 ? '#2563EB' : dim.score >= 40 ? '#A16207' : '#DC2626',
              }}
            >
              {dim.label}
            </span>
          </div>
        ))}
      </div>

      {/* Expandable Report Sections */}
      {SECTION_ORDER.map((key) => {
        const section = report.sections[key as keyof typeof report.sections] as ReportSection
        if (!section) return null

        const meta = SECTION_META[key] || { icon: Brain, color: '#7B68B5' }
        const Icon = meta.icon
        const isExpanded = expandedSections.has(key)
        const isGrowthEdges = key === 'growthEdges'

        return (
          <div
            key={key}
            className="rounded-2xl border overflow-hidden transition-all print:border-0"
            style={{
              borderColor: isGrowthEdges ? 'var(--ciq-coral)' : 'var(--border)',
              background: 'var(--bg-card)',
            }}
          >
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-5 text-left print:cursor-default"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${meta.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: meta.color }} />
                </div>
                <h3
                  className="text-sm font-bold"
                  style={{
                    color: isGrowthEdges ? 'var(--ciq-coral)' : 'var(--text-primary)',
                  }}
                >
                  {section.title}
                </h3>
              </div>
              <div className="print:hidden">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                ) : (
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
            </button>

            {(isExpanded || typeof window !== 'undefined' && window.matchMedia?.('print').matches) && (
              <div className="px-5 pb-5 space-y-4">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {section.narrative}
                </p>

                {section.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {section.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{
                            background: isGrowthEdges ? 'var(--ciq-coral)' : meta.color,
                          }}
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* CIQ Card at Bottom */}
      <div className="pt-4 print:hidden">
        <p className="text-center text-xs font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
          Your Shareable CIQ Card
        </p>
        <CIQCard
          firstName={report.firstName}
          topTraits={report.topTraits}
          attachmentStyleLabel={report.attachmentStyleLabel}
          primaryLoveLanguage={report.loveLanguageRanking[0]?.label || 'Quality Time'}
          eqScore={Math.round(
            Object.values(report.eqBreakdown).reduce((sum, v) => sum + v, 0) /
            Object.values(report.eqBreakdown).length / 5 * 100
          )}
        />
      </div>
    </div>
  )
}
