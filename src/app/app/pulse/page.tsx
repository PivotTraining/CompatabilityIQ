// @ts-nocheck
'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  getWeeklyQuestions,
  getISOWeekNumber,
  getISOWeekYear,
} from '@/lib/assessment/pulse-questions'
import type { PulseQuestion } from '@/lib/assessment/pulse-questions'

// ─── Types ──────────────────────────────────────────────

interface PulseResponse {
  readonly questionId: string
  readonly value: number
}

interface PulseResult {
  readonly score: number
  readonly previousScore: number | null
  readonly weekNumber: number
  readonly year: number
}

interface ExistingPulse {
  readonly score: number
  readonly responses: readonly PulseResponse[]
  readonly week_number: number
  readonly year: number
  readonly created_at: string
}

interface RecentPulse {
  readonly week_number: number
  readonly year: number
  readonly score: number
  readonly created_at: string
}

type ViewState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'already_completed'; readonly pulse: ExistingPulse; readonly recentPulses: readonly RecentPulse[] }
  | { readonly kind: 'question'; readonly index: number }
  | { readonly kind: 'submitting' }
  | { readonly kind: 'complete'; readonly result: PulseResult }
  | { readonly kind: 'error'; readonly message: string }

// ─── Constants ──────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  emotional_awareness: 'Emotional Awareness',
  relationship_readiness: 'Relationship Readiness',
  self_growth: 'Self-Growth',
  communication: 'Communication',
}

const MOTIVATIONAL_MESSAGES: readonly { readonly min: number; readonly max: number; readonly message: string }[] = [
  { min: 0, max: 25, message: 'Every journey starts somewhere. You\'re already ahead by showing up.' },
  { min: 26, max: 50, message: 'You\'re building awareness — that\'s the first step to real growth.' },
  { min: 51, max: 75, message: 'Strong week. You\'re putting in the inner work and it shows.' },
  { min: 76, max: 100, message: 'Incredible self-awareness. You\'re exactly where you need to be.' },
]

function getMotivationalMessage(score: number): string {
  const entry = MOTIVATIONAL_MESSAGES.find(
    (m) => score >= m.min && score <= m.max
  )
  return entry?.message ?? 'Keep going — consistency is everything.'
}

function getTrendArrow(
  current: number,
  previous: number | null
): { symbol: string; label: string; color: string } {
  if (previous === null) {
    return { symbol: '—', label: 'First pulse', color: 'var(--text-muted)' }
  }
  const diff = current - previous
  if (diff > 2) return { symbol: '↑', label: `+${Math.round(diff)}`, color: '#22c55e' }
  if (diff < -2) return { symbol: '↓', label: `${Math.round(diff)}`, color: '#ef4444' }
  return { symbol: '→', label: 'Steady', color: 'var(--ciq-purple)' }
}

// ─── Component ──────────────────────────────────────────

export default function PulsePage() {
  const { user } = useAuth()
  const router = useRouter()

  const now = useMemo(() => new Date(), [])
  const weekNumber = useMemo(() => getISOWeekNumber(now), [now])
  const questions = useMemo(() => getWeeklyQuestions(weekNumber), [weekNumber])

  const [viewState, setViewState] = useState<ViewState>({ kind: 'loading' })
  const [responses, setResponses] = useState<readonly PulseResponse[]>([])
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<'enter' | 'exit'>('enter')

  // ── Check for existing pulse ──
  useEffect(() => {
    if (!user) return

    const checkExisting = async () => {
      try {
        const res = await fetch('/api/pulse/submit')
        if (!res.ok) {
          setViewState({ kind: 'error', message: 'Failed to load pulse data' })
          return
        }
        const json = await res.json()
        if (json.data?.currentWeek) {
          setViewState({
            kind: 'already_completed',
            pulse: json.data.currentWeek,
            recentPulses: json.data.recentPulses ?? [],
          })
        } else {
          setViewState({ kind: 'question', index: 0 })
        }
      } catch {
        setViewState({ kind: 'error', message: 'Unable to connect. Please try again.' })
      }
    }

    checkExisting()
  }, [user])

  // ── Handle option selection ──
  const handleSelect = useCallback(
    async (question: PulseQuestion, value: number) => {
      if (viewState.kind !== 'question') return

      setSelectedValue(value)

      const newResponse: PulseResponse = {
        questionId: question.id,
        value,
      }
      const updatedResponses = [...responses, newResponse]

      // Brief delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 400))

      if (updatedResponses.length === 3) {
        // All questions answered — submit
        setViewState({ kind: 'submitting' })
        setResponses(updatedResponses)

        try {
          const res = await fetch('/api/pulse/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses: updatedResponses }),
          })

          if (!res.ok) {
            const json = await res.json()
            setViewState({
              kind: 'error',
              message: json.error ?? 'Failed to submit pulse',
            })
            return
          }

          const json = await res.json()
          setViewState({
            kind: 'complete',
            result: json.data,
          })
        } catch {
          setViewState({
            kind: 'error',
            message: 'Unable to submit. Please try again.',
          })
        }
      } else {
        // Transition to next question
        setSlideDirection('exit')
        await new Promise((resolve) => setTimeout(resolve, 300))
        setResponses(updatedResponses)
        setSelectedValue(null)
        setSlideDirection('enter')
        setViewState({ kind: 'question', index: updatedResponses.length })
      }
    },
    [viewState, responses]
  )

  // ── Render Guards ──
  if (!user) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Please sign in to access CIQ Pulse.</p>
      </div>
    )
  }

  // ── Loading ──
  if (viewState.kind === 'loading') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.pulseIconWrap}>
            <PulseIcon />
          </div>
          <h1 style={styles.title}>CIQ Pulse</h1>
          <p style={styles.subtitle}>Loading your weekly check-in...</p>
        </div>
        <div style={styles.loadingDots}>
          <span style={{ ...styles.dot, animationDelay: '0s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
        </div>
      </div>
    )
  }

  // ── Error ──
  if (viewState.kind === 'error') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.pulseIconWrap}>
            <PulseIcon />
          </div>
          <h1 style={styles.title}>CIQ Pulse</h1>
        </div>
        <div style={styles.errorCard}>
          <p style={styles.errorText}>{viewState.message}</p>
          <button
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // ── Already Completed ──
  if (viewState.kind === 'already_completed') {
    const { pulse, recentPulses } = viewState
    const trend = recentPulses.length > 1
      ? getTrendArrow(pulse.score, recentPulses[1]?.score ?? null)
      : getTrendArrow(pulse.score, null)

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.pulseIconWrap}>
            <PulseIcon />
          </div>
          <h1 style={styles.title}>CIQ Pulse</h1>
          <p style={styles.subtitle}>Week {weekNumber} — Complete</p>
        </div>

        <div style={styles.resultCard}>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreValue}>{Math.round(pulse.score)}</span>
            <span style={styles.scoreLabel}>/ 100</span>
          </div>

          <div style={styles.trendRow}>
            <span style={{ ...styles.trendArrow, color: trend.color }}>
              {trend.symbol}
            </span>
            <span style={styles.trendLabel}>{trend.label}</span>
          </div>

          <p style={styles.motivationalText}>
            {getMotivationalMessage(pulse.score)}
          </p>

          {recentPulses.length > 1 && (
            <div style={styles.miniTrend}>
              <p style={styles.miniTrendTitle}>Recent Weeks</p>
              <div style={styles.miniTrendRow}>
                {[...recentPulses].reverse().map((p) => (
                  <div key={`${p.year}-${p.week_number}`} style={styles.miniTrendItem}>
                    <div
                      style={{
                        ...styles.miniBar,
                        height: `${Math.max(p.score * 0.6, 8)}px`,
                      }}
                    />
                    <span style={styles.miniWeekLabel}>W{p.week_number}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button style={styles.trendButton} disabled>
          View Full Trends (Coming Soon)
        </button>
      </div>
    )
  }

  // ── Submitting ──
  if (viewState.kind === 'submitting') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.pulseIconWrap}>
            <PulseIcon />
          </div>
          <h1 style={styles.title}>CIQ Pulse</h1>
          <p style={styles.subtitle}>Calculating your pulse...</p>
        </div>
        <div style={styles.loadingDots}>
          <span style={{ ...styles.dot, animationDelay: '0s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
        </div>
      </div>
    )
  }

  // ── Celebration / Complete ──
  if (viewState.kind === 'complete') {
    const { result } = viewState
    const trend = getTrendArrow(result.score, result.previousScore)

    return (
      <div style={styles.container}>
        <style>{confettiKeyframes}</style>
        <div style={styles.confettiContainer}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.confettiPiece,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              }}
            />
          ))}
        </div>

        <div style={styles.header}>
          <div style={styles.pulseIconWrap}>
            <PulseIcon />
          </div>
          <h1 style={styles.title}>Pulse Complete!</h1>
          <p style={styles.subtitle}>Week {result.weekNumber}</p>
        </div>

        <div style={styles.resultCard}>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreValue}>{Math.round(result.score)}</span>
            <span style={styles.scoreLabel}>/ 100</span>
          </div>

          <div style={styles.trendRow}>
            <span style={{ ...styles.trendArrow, color: trend.color }}>
              {trend.symbol}
            </span>
            <span style={styles.trendLabel}>{trend.label}</span>
          </div>

          <p style={styles.motivationalText}>
            {getMotivationalMessage(result.score)}
          </p>
        </div>

        <button style={styles.trendButton} disabled>
          View Full Trends (Coming Soon)
        </button>
      </div>
    )
  }

  // ── Question View ──
  const currentIndex = viewState.index
  const currentQuestion = questions[currentIndex]

  return (
    <div style={styles.container}>
      <style>{animationKeyframes}</style>

      <div style={styles.header}>
        <div style={styles.pulseIconWrap}>
          <PulseIcon />
        </div>
        <h1 style={styles.title}>CIQ Pulse</h1>
        <p style={styles.subtitle}>Weekly Check-In</p>
      </div>

      {/* Progress */}
      <div style={styles.progressRow}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              ...styles.progressDot,
              ...(i < currentIndex
                ? styles.progressDotComplete
                : i === currentIndex
                  ? styles.progressDotActive
                  : {}),
            }}
          >
            {i + 1}
          </div>
        ))}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${((currentIndex) / 3) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Category Badge */}
      <div style={styles.categoryBadge}>
        {CATEGORY_LABELS[currentQuestion.category] ?? currentQuestion.category}
      </div>

      {/* Question */}
      <div
        style={{
          ...styles.questionSlide,
          animation:
            slideDirection === 'enter'
              ? 'pulseSlideIn 0.3s ease-out forwards'
              : 'pulseSlideOut 0.3s ease-in forwards',
        }}
      >
        <p style={styles.questionText}>{currentQuestion.text}</p>

        <div style={styles.optionsGrid}>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedValue === option.value
            return (
              <button
                key={option.value}
                style={{
                  ...styles.optionCard,
                  ...(isSelected ? styles.optionCardSelected : {}),
                }}
                onClick={() => handleSelect(currentQuestion, option.value)}
                disabled={selectedValue !== null}
              >
                <span style={styles.optionValue}>{option.value}</span>
                <span style={styles.optionLabel}>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <p style={styles.questionCounter}>
        {currentIndex + 1} of 3
      </p>
    </div>
  )
}

// ─── Pulse Icon SVG ─────────────────────────────────────

function PulseIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

// ─── Animations ─────────────────────────────────────────

const animationKeyframes = `
  @keyframes pulseSlideIn {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulseSlideOut {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(-40px); }
  }
  @keyframes pulseDot {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }
`

const confettiKeyframes = `
  @keyframes confettiFall {
    0%   { opacity: 1; transform: translateY(-20px) rotate(0deg); }
    100% { opacity: 0; transform: translateY(400px) rotate(720deg); }
  }
`

const CONFETTI_COLORS = [
  '#a855f7', '#c084fc', '#7c3aed', '#e879f9',
  '#f0abfc', '#d946ef', '#6d28d9', '#8b5cf6',
]

// ─── Styles ─────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px 48px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    position: 'relative',
    overflow: 'hidden',
  },

  // Header
  header: {
    width: '100%',
    maxWidth: '480px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)',
    borderRadius: '20px',
    padding: '32px 24px 28px',
    marginBottom: '24px',
    color: '#fff',
  },
  pulseIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '14px',
    opacity: 0.85,
    margin: 0,
  },

  // Progress
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
    justifyContent: 'center',
  },
  progressDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 600,
    backgroundColor: 'var(--bg-card)',
    border: '2px solid var(--border)',
    color: 'var(--text-muted)',
    zIndex: 1,
    transition: 'all 0.3s ease',
  },
  progressDotActive: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
    color: '#fff',
    transform: 'scale(1.1)',
  },
  progressDotComplete: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
    color: '#fff',
  },
  progressBar: {
    position: 'absolute',
    top: '50%',
    left: '15%',
    right: '15%',
    height: '3px',
    backgroundColor: 'var(--border)',
    transform: 'translateY(-50%)',
    borderRadius: '2px',
    zIndex: 0,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: '2px',
    transition: 'width 0.4s ease',
  },

  // Category
  categoryBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '20px',
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    color: '#a855f7',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '20px',
  },

  // Question slide
  questionSlide: {
    width: '100%',
    maxWidth: '480px',
  },
  questionText: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.5,
    textAlign: 'center',
    marginBottom: '24px',
    color: 'var(--text-primary)',
  },

  // Options
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 18px',
    borderRadius: '14px',
    border: '2px solid var(--border)',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '15px',
    lineHeight: 1.4,
    transition: 'all 0.2s ease',
    outline: 'none',
    width: '100%',
  },
  optionCardSelected: {
    borderColor: '#a855f7',
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    transform: 'scale(1.02)',
  },
  optionValue: {
    flexShrink: 0,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 700,
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    color: '#a855f7',
  },
  optionLabel: {
    flex: 1,
  },

  // Counter
  questionCounter: {
    marginTop: '20px',
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },

  // Results
  resultCard: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '32px 24px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(168, 85, 247, 0.1))',
    border: '3px solid #a855f7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  scoreValue: {
    fontSize: '36px',
    fontWeight: 800,
    color: '#a855f7',
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  trendRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  trendArrow: {
    fontSize: '24px',
    fontWeight: 700,
  },
  trendLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  motivationalText: {
    fontSize: '15px',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    margin: 0,
  },

  // Mini trend chart
  miniTrend: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid var(--border)',
  },
  miniTrendTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px',
  },
  miniTrendRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '16px',
  },
  miniTrendItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  miniBar: {
    width: '24px',
    borderRadius: '4px 4px 0 0',
    background: 'linear-gradient(to top, #7c3aed, #a855f7)',
    minHeight: '8px',
    transition: 'height 0.3s ease',
  },
  miniWeekLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },

  // Buttons
  trendButton: {
    padding: '14px 28px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-muted)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'not-allowed',
    opacity: 0.6,
    width: '100%',
    maxWidth: '480px',
  },
  retryButton: {
    marginTop: '16px',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  // Loading dots
  loadingDots: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#a855f7',
    animation: 'pulseDot 1.4s infinite ease-in-out',
    display: 'inline-block',
  },

  // Error
  errorCard: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
  },
  errorText: {
    color: 'var(--text-secondary)',
    fontSize: '15px',
    margin: 0,
  },

  // Confetti
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0,
  },
  confettiPiece: {
    position: 'absolute',
    top: '-10px',
    width: '8px',
    height: '8px',
    borderRadius: '2px',
    animation: 'confettiFall 3s ease-in forwards',
  },
}
