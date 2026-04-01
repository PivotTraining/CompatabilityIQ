// @ts-nocheck
'use client'

import { useEffect, useRef } from 'react'
import { X, Heart, MessageCircle, TrendingUp, Sparkles } from 'lucide-react'
import { getCISTier, CIS_TIERS } from '@/lib/constants'
import { DIMENSION_CONFIGS } from '@/lib/scoring/constants'

// ═══════════════════════════════════════════
// Types
// ═══════════════════════════════════════════

interface CompatibilityInsightsProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly cisScore: number | null
  readonly userScores: Readonly<Record<string, number>>
  readonly partnerScores: Readonly<Record<string, number>>
  readonly partnerName: string
}

interface DimensionLabel {
  readonly dimensionName: string
  readonly label: string
  readonly score: number
}

interface InsightTip {
  readonly icon: typeof Heart
  readonly title: string
  readonly description: string
}

// ═══════════════════════════════════════════
// Score Label Helpers
// ═══════════════════════════════════════════

function getDimensionLabel(score: number): string {
  if (score >= 80) return 'Strong alignment'
  if (score >= 60) return 'Good compatibility'
  if (score >= 40) return 'Growth opportunity'
  return 'Area to navigate mindfully'
}

function getLabelColor(score: number): string {
  if (score >= 80) return '#16A34A'
  if (score >= 60) return '#2563EB'
  if (score >= 40) return '#D97706'
  return '#6B7280'
}

function getLabelBg(score: number): string {
  if (score >= 80) return '#DCFCE7'
  if (score >= 60) return '#DBEAFE'
  if (score >= 40) return '#FEF3C7'
  return '#F3F4F6'
}

// ═══════════════════════════════════════════
// Attachment Style Detection
// ═══════════════════════════════════════════

type AttachmentCategory = 'secure' | 'anxious' | 'avoidant'

function classifyAttachment(score: number): AttachmentCategory {
  if (score >= 70) return 'secure'
  if (score >= 45) return 'anxious'
  return 'avoidant'
}

function getAttachmentTip(
  userStyle: AttachmentCategory,
  partnerStyle: AttachmentCategory,
): string {
  const key = [userStyle, partnerStyle].sort().join('_')

  const tips: Record<string, string> = {
    secure_secure: 'You both value open communication and trust',
    anxious_secure: 'Be consistent with reassurance and check-ins',
    avoidant_secure: 'Respect need for space while staying emotionally available',
    anxious_anxious: 'Set healthy boundaries while validating each other\'s feelings',
    anxious_avoidant: 'Find middle ground between closeness and independence',
    avoidant_avoidant: 'Schedule regular emotional check-ins to stay connected',
  }

  return tips[key] ?? 'Stay curious about each other\'s emotional needs'
}

// ═══════════════════════════════════════════
// Conflict Style Detection
// ═══════════════════════════════════════════

type ConflictCategory = 'collaborative' | 'competitive' | 'avoidant' | 'mixed'

function classifyConflict(score: number): ConflictCategory {
  if (score >= 75) return 'collaborative'
  if (score >= 55) return 'competitive'
  if (score >= 35) return 'avoidant'
  return 'mixed'
}

function getConflictTip(
  userStyle: ConflictCategory,
  partnerStyle: ConflictCategory,
): string {
  if (userStyle === 'collaborative' && partnerStyle === 'collaborative') {
    return 'You naturally work through disagreements together'
  }
  if (userStyle === 'competitive' || partnerStyle === 'competitive') {
    return 'Practice active listening before responding'
  }
  if (userStyle === 'avoidant' && partnerStyle === 'avoidant') {
    return 'Set a "discussion date" to address issues before they build'
  }
  return 'Acknowledge each other\'s conflict approach and find compromise'
}

// ═══════════════════════════════════════════
// Shared Strengths & Growth Areas
// ═══════════════════════════════════════════

function computeDimensionLabels(
  userScores: Readonly<Record<string, number>>,
  partnerScores: Readonly<Record<string, number>>,
): readonly DimensionLabel[] {
  const dimensionKeys = Object.keys(DIMENSION_CONFIGS)

  return dimensionKeys
    .filter((key) => userScores[key] != null && partnerScores[key] != null)
    .map((key) => {
      const config = DIMENSION_CONFIGS[key]
      const avgScore = (userScores[key] + partnerScores[key]) / 2
      const normalizedScore = Math.round((avgScore / 5) * 100)
      return {
        dimensionName: config?.name ?? key,
        label: getDimensionLabel(normalizedScore),
        score: normalizedScore,
      }
    })
    .sort((a, b) => b.score - a.score)
}

function getSharedStrengths(
  labels: readonly DimensionLabel[],
): readonly DimensionLabel[] {
  return labels.filter((d) => d.score >= 60).slice(0, 3)
}

function getGrowthArea(
  labels: readonly DimensionLabel[],
): DimensionLabel | null {
  const sorted = [...labels].sort((a, b) => a.score - b.score)
  return sorted[0] ?? null
}

// ═══════════════════════════════════════════
// Build Insights
// ═══════════════════════════════════════════

function buildCommunicationTips(
  userScores: Readonly<Record<string, number>>,
  partnerScores: Readonly<Record<string, number>>,
): readonly InsightTip[] {
  const tips: InsightTip[] = []

  const userAttachment = userScores['attachment']
  const partnerAttachment = partnerScores['attachment']
  if (userAttachment != null && partnerAttachment != null) {
    const userStyle = classifyAttachment(Math.round((userAttachment / 5) * 100))
    const partnerStyle = classifyAttachment(Math.round((partnerAttachment / 5) * 100))
    tips.push({
      icon: Heart,
      title: 'Attachment',
      description: getAttachmentTip(userStyle, partnerStyle),
    })
  }

  const userComm = userScores['communication']
  const partnerComm = partnerScores['communication']
  if (userComm != null && partnerComm != null) {
    const userStyle = classifyConflict(Math.round((userComm / 5) * 100))
    const partnerStyle = classifyConflict(Math.round((partnerComm / 5) * 100))
    tips.push({
      icon: MessageCircle,
      title: 'Conflict Resolution',
      description: getConflictTip(userStyle, partnerStyle),
    })
  }

  return tips
}

// ═══════════════════════════════════════════
// Component
// ═══════════════════════════════════════════

export default function CompatibilityInsights({
  isOpen,
  onClose,
  cisScore,
  userScores,
  partnerScores,
  partnerName,
}: CompatibilityInsightsProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Close on click outside (mobile overlay)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const hasScores =
    Object.keys(userScores).length > 0 && Object.keys(partnerScores).length > 0

  const dimensionLabels = hasScores
    ? computeDimensionLabels(userScores, partnerScores)
    : []
  const sharedStrengths = getSharedStrengths(dimensionLabels)
  const growthArea = getGrowthArea(dimensionLabels)
  const communicationTips = hasScores
    ? buildCommunicationTips(userScores, partnerScores)
    : []

  const tier = cisScore != null ? getCISTier(cisScore) : null
  const tierInfo = tier ? CIS_TIERS[tier] : null

  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`
          fixed top-0 right-0 z-50 h-full w-[320px] max-w-[85vw]
          md:static md:z-auto md:h-auto md:w-[320px] md:min-w-[320px]
          overflow-y-auto border-l
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:hidden'}
        `}
        style={{
          background: 'var(--bg-primary)',
          borderColor: 'var(--border)',
        }}
        role="complementary"
        aria-label="Compatibility insights"
      >
        {/* Header with gradient */}
        <div
          className="px-4 py-4"
          style={{
            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/90" />
              <h3 className="text-sm font-semibold text-white">
                Compatibility Insights
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close insights panel"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>
          </div>
          <p className="text-xs text-white/70">
            Your compatibility with {partnerName}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {!hasScores ? (
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: 'var(--bg-card)' }}
            >
              <p
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Assessment data is not yet available for this match.
              </p>
            </div>
          ) : (
            <>
              {/* Compatibility Tier */}
              {tierInfo && cisScore != null && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <p
                    className="text-xs font-medium mb-2 uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Overall Match
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                      style={{
                        background:
                          tier === 'rare'
                            ? 'linear-gradient(135deg, #9333EA, #EC4899)'
                            : tierInfo.bg,
                        color: tier === 'rare' ? '#fff' : tierInfo.color,
                      }}
                    >
                      {tierInfo.label}
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {tier === 'rare' && 'An exceptional connection'}
                      {tier === 'synergistic' && 'A strong, natural fit'}
                      {tier === 'compatible' && 'Solid foundation to build on'}
                      {tier === 'misaligned' && 'Differences to explore'}
                    </p>
                  </div>
                </div>
              )}

              {/* Shared Strengths */}
              {sharedStrengths.length > 0 && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <p
                    className="text-xs font-medium mb-3 uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Shared Strengths
                  </p>
                  <div className="space-y-2.5">
                    {sharedStrengths.map((strength) => (
                      <div
                        key={strength.dimensionName}
                        className="flex items-center justify-between"
                      >
                        <span
                          className="text-sm"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {strength.dimensionName}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: getLabelBg(strength.score),
                            color: getLabelColor(strength.score),
                          }}
                        >
                          {strength.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communication Tips */}
              {communicationTips.length > 0 && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <p
                    className="text-xs font-medium mb-3 uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Communication Tips
                  </p>
                  <div className="space-y-3">
                    {communicationTips.map((tip) => {
                      const Icon = tip.icon
                      return (
                        <div key={tip.title} className="flex gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: '#F3E8FF' }}
                          >
                            <Icon className="w-4 h-4" style={{ color: '#9333EA' }} />
                          </div>
                          <div>
                            <p
                              className="text-xs font-medium"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {tip.title}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {tip.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Growth Area */}
              {growthArea && growthArea.score < 60 && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp
                      className="w-4 h-4"
                      style={{ color: '#D97706' }}
                    />
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Growth Area
                    </p>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {growthArea.dimensionName}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    This is where you differ most. Use it as an opportunity
                    to learn from each other and grow together.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
