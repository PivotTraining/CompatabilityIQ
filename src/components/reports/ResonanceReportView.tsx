'use client'

// CompatibleIQ -- Resonance Report View
// Premium $4.99 compatibility breakdown — polished, insightful, actionable

import { useState, useRef } from 'react'
import type { ResonanceReport, DimensionReport, MatchIndicator } from '@/lib/reports/types'

// ═══════════════════════════════════════════
// Props
// ═══════════════════════════════════════════

interface ResonanceReportViewProps {
  report: ResonanceReport
  partnerName: string
}

// ═══════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════

const TIER_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  rare: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    label: 'Rare Match',
  },
  synergistic: {
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    label: 'Synergistic',
  },
  compatible: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    label: 'Compatible',
  },
  misaligned: {
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    label: 'Misaligned',
  },
}

const INDICATOR_CONFIG: Record<MatchIndicator, { color: string; bg: string; icon: string }> = {
  'Strong Match': { color: 'text-green-400', bg: 'bg-green-500/10', icon: '\u2713\u2713' },
  'Good Match': { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '\u2713' },
  'Growth Area': { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: '\u2191' },
  'Watch Out': { color: 'text-red-400', bg: 'bg-red-500/10', icon: '!' },
}

const DIMENSION_ICONS: Record<string, string> = {
  values: '\u2666',
  attachment: '\u2764',
  communication: '\u2604',
  emotional_intelligence: '\u2728',
  lifestyle_ambition: '\u2600',
  love_languages: '\u2661',
}

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════

export function ResonanceReportView({ report, partnerName }: ResonanceReportViewProps) {
  const [expandedStrengths, setExpandedStrengths] = useState(true)
  const [expandedFriction, setExpandedFriction] = useState(true)
  const [expandedTrajectory, setExpandedTrajectory] = useState(true)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const tierConfig = TIER_CONFIG[report.tier] || TIER_CONFIG.compatible

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div
        ref={reportRef}
        className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 print:max-w-none print:px-8"
      >
        {/* ── Header ────────────────────────────── */}
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ciq-purple)]">
            CompatibleIQ Resonance Report
          </p>
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            You & {partnerName}
          </h1>

          {/* Overall Score Ring */}
          <div className="mx-auto mb-6 flex flex-col items-center">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="var(--ciq-purple)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(report.overallScore / 100) * 327} 327`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="text-center">
                <span className="text-4xl font-bold text-[var(--text-primary)]">
                  {report.overallScore}
                </span>
                <span className="text-lg text-[var(--text-secondary)]">/100</span>
              </div>
            </div>

            {/* Tier Badge */}
            <div
              className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${tierConfig.bg} ${tierConfig.border} ${tierConfig.color}`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {report.tierLabel}
            </div>
          </div>

          {/* Summary */}
          <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--text-secondary)]">
            {report.summary}
          </p>
        </header>

        {/* ── Dimension Cards ───────────────────── */}
        <section className="mb-10">
          <SectionHeading>Dimension Breakdown</SectionHeading>
          <div className="space-y-4">
            {report.dimensions.map((dim) => (
              <DimensionCard key={dim.dimensionId} dim={dim} />
            ))}
          </div>
        </section>

        {/* ── Strengths ─────────────────────────── */}
        <section className="mb-10">
          <CollapsibleSection
            title="Strengths as a Pair"
            subtitle="Your top 3 compatibility dimensions"
            expanded={expandedStrengths}
            onToggle={() => setExpandedStrengths(!expandedStrengths)}
          >
            <div className="space-y-4">
              {report.strengths.map((s, i) => (
                <div
                  key={s.dimensionId}
                  className="rounded-xl border border-green-500/20 bg-green-500/5 p-5"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20 text-sm font-bold text-green-400">
                      {i + 1}
                    </span>
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {s.dimensionName}
                    </h4>
                    <span className="ml-auto text-sm font-medium text-green-400">
                      {s.score}/100
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {s.narrative}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </section>

        {/* ── Friction Points ───────────────────── */}
        <section className="mb-10">
          <CollapsibleSection
            title="Growth Areas"
            subtitle="Where intentional effort pays dividends"
            expanded={expandedFriction}
            onToggle={() => setExpandedFriction(!expandedFriction)}
          >
            <div className="space-y-4">
              {report.frictionPoints.map((f, i) => (
                <div
                  key={f.dimensionId}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-400">
                      {i + 1}
                    </span>
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {f.dimensionName}
                    </h4>
                    <span className="ml-auto text-sm font-medium text-amber-400">
                      {f.score}/100
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {f.narrative}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </section>

        {/* ── Conversation Starters ─────────────── */}
        <section className="mb-10">
          <SectionHeading>Conversation Starters</SectionHeading>
          <p className="mb-4 text-sm text-[var(--text-muted)]">
            Five prompts to deepen your connection, based on your compatibility data.
          </p>
          <div className="space-y-3">
            {report.conversationStarters.map((starter, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm transition-colors hover:border-[var(--ciq-purple)]/30"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--ciq-purple)]/10">
                  <span className="text-sm font-bold text-[var(--ciq-purple)]">{i + 1}</span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-primary)]">{starter}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Trajectory Timeline ───────────────── */}
        <section className="mb-10">
          <CollapsibleSection
            title="Compatibility Trajectory"
            subtitle="What to expect as your relationship evolves"
            expanded={expandedTrajectory}
            onToggle={() => setExpandedTrajectory(!expandedTrajectory)}
          >
            <div className="relative ml-4 space-y-8 border-l-2 border-[var(--ciq-purple)]/20 pl-8">
              <TrajectoryPhase
                phase="Early Phase"
                timeframe="First 3 months"
                description={report.trajectory.earlyPhase}
                dotColor="bg-[var(--ciq-purple)]"
              />
              <TrajectoryPhase
                phase="Building Phase"
                timeframe="3 - 12 months"
                description={report.trajectory.buildingPhase}
                dotColor="bg-[var(--ciq-blue)]"
              />
              <TrajectoryPhase
                phase="Long-Term"
                timeframe="1+ years"
                description={report.trajectory.longTerm}
                dotColor="bg-[var(--ciq-green)]"
              />
            </div>
          </CollapsibleSection>
        </section>

        {/* ── Actions ───────────────────────────── */}
        <footer className="flex flex-col items-center gap-4 border-t border-[var(--border)] pt-8 print:hidden">
          <div className="flex gap-3">
            <button
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ciq-purple)] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--ciq-purple)]/90 hover:shadow-lg active:scale-[0.98]"
            >
              <ShareIcon />
              Share Preview
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition-all hover:border-[var(--ciq-purple)]/30 hover:shadow-md active:scale-[0.98]"
            >
              <PrintIcon />
              Print Report
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Generated {new Date(report.generatedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </footer>
      </div>

      {/* ── Share Modal ─────────────────────────── */}
      {shareModalOpen && (
        <ShareModal
          report={report}
          partnerName={partnerName}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xl font-bold tracking-tight text-[var(--text-primary)]">
      {children}
    </h2>
  )
}

function DimensionCard({ dim }: { dim: DimensionReport }) {
  const [expanded, setExpanded] = useState(false)
  const indicator = INDICATOR_CONFIG[dim.indicator]
  const icon = DIMENSION_ICONS[dim.dimensionId] || '\u25CF'

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm transition-shadow hover:shadow-md">
      {/* Card Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[var(--bg-secondary)]/50"
      >
        <span className="text-xl">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-[var(--text-primary)]">{dim.dimensionName}</h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${indicator.bg} ${indicator.color}`}
            >
              <span className="text-[10px]">{indicator.icon}</span>
              {dim.indicator}
            </span>
          </div>
          {/* Score Bar */}
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${dim.score}%`,
                  backgroundColor: getScoreColor(dim.score),
                }}
              />
            </div>
            <span className="w-10 text-right text-sm font-semibold text-[var(--text-primary)]">
              {dim.score}
            </span>
          </div>
        </div>
        <ChevronIcon expanded={expanded} />
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-[var(--border)] px-5 pb-5 pt-4">
          {/* User Profiles */}
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-[var(--bg-secondary)] p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--ciq-purple)]">
                You
              </p>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {dim.userAProfile}
              </p>
            </div>
            <div className="rounded-lg bg-[var(--bg-secondary)] p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--ciq-coral)]">
                Your Match
              </p>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {dim.userBProfile}
              </p>
            </div>
          </div>

          {/* Compatibility Narrative */}
          <div className="rounded-lg border border-[var(--ciq-purple)]/10 bg-[var(--ciq-purple)]/5 p-4">
            <p className="text-sm font-medium text-[var(--ciq-purple)]">Compatibility Insight</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              {dim.compatibilityNarrative}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function CollapsibleSection({
  title,
  subtitle,
  expanded,
  onToggle,
  children,
}: {
  title: string
  subtitle: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="mb-4 flex w-full items-center justify-between text-left"
      >
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h2>
          <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
        </div>
        <ChevronIcon expanded={expanded} />
      </button>
      {expanded && children}
    </div>
  )
}

function TrajectoryPhase({
  phase,
  timeframe,
  description,
  dotColor,
}: {
  phase: string
  timeframe: string
  description: string
  dotColor: string
}) {
  return (
    <div className="relative">
      <div
        className={`absolute -left-[calc(2rem+5px)] top-1 h-3 w-3 rounded-full ${dotColor} ring-4 ring-[var(--bg-primary)]`}
      />
      <div>
        <h4 className="font-semibold text-[var(--text-primary)]">{phase}</h4>
        <p className="mb-1 text-xs font-medium text-[var(--text-muted)]">{timeframe}</p>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
  )
}

function ShareModal({
  report,
  partnerName,
  onClose,
}: {
  report: ResonanceReport
  partnerName: string
  onClose: () => void
}) {
  const tierConfig = TIER_CONFIG[report.tier] || TIER_CONFIG.compatible

  const handleCopyLink = () => {
    const shareText = `I just got my CompatibleIQ Resonance Report! Score: ${report.overallScore}/100 (${report.tierLabel}). Find out your compatibility at compatibilityiq.com`
    navigator.clipboard.writeText(shareText).then(() => {
      // Could show a toast here
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm print:hidden">
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-2xl">
        {/* Blurred Preview Card */}
        <div className="relative bg-gradient-to-br from-[var(--ciq-purple)] to-[var(--ciq-blue)] p-8 text-center text-white">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
            Resonance Report
          </p>
          <p className="mb-4 text-lg font-bold">You & {partnerName}</p>
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <span className="text-3xl font-bold">{report.overallScore}</span>
          </div>
          <div
            className={`mx-auto inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-semibold`}
          >
            {report.tierLabel}
          </div>
          {/* Blur overlay for details */}
          <div className="mt-6 space-y-2">
            {report.dimensions.slice(0, 3).map((d) => (
              <div key={d.dimensionId} className="flex items-center gap-3 text-sm opacity-60">
                <span className="w-32 text-left">{d.dimensionName}</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white/60"
                    style={{ width: `${d.score}%`, filter: 'blur(2px)' }}
                  />
                </div>
              </div>
            ))}
            <p className="pt-2 text-xs opacity-50">Get your full report at compatibilityiq.com</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 p-6">
          <button
            onClick={handleCopyLink}
            className="w-full rounded-xl bg-[var(--ciq-purple)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--ciq-purple)]/90"
          >
            Copy Share Text
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-[var(--border)] py-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// Icons (inline SVGs to avoid dependencies)
// ═══════════════════════════════════════════

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
        expanded ? 'rotate-180' : ''
      }`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
    </svg>
  )
}

function PrintIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
      />
    </svg>
  )
}

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--ciq-green)'
  if (score >= 65) return 'var(--ciq-blue)'
  if (score >= 45) return 'var(--ciq-gold)'
  return 'var(--ciq-coral)'
}
