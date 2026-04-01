'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAssessmentStore } from '@/store/assessment-store'
import { getPersonalizedQuestions } from '@/lib/assessment/question-router'
import { MODULE_CONFIG, getUnlockedProfileCount } from '@/lib/constants'
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AssessmentQuestion } from '@/lib/assessment/types'

// ═══════════════════════════════════════════
// Animation Variants
// ═══════════════════════════════════════════

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
}

const optionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2 },
  }),
}

const celebrationVariants = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 18 },
  },
}

const confettiVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: [0, 1, 1, 0],
    y: [0, -40, -60, 20],
    x: [(i % 2 === 0 ? -1 : 1) * (20 + i * 10), (i % 2 === 0 ? 1 : -1) * (30 + i * 8)],
    rotate: [0, (i % 2 === 0 ? 180 : -180)],
    transition: { duration: 1.5, delay: 0.2 + i * 0.1 },
  }),
}

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════

export default function ModuleAssessmentPage() {
  const router = useRouter()
  const params = useParams()
  const moduleNum = Number(params.module)
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()

  const {
    draftAnswers,
    currentIndex,
    setAnswer,
    setCurrentIndex,
    completeModule,
    clearDraft,
    setAssessmentProgress,
    assessmentProgress,
  } = useAssessmentStore()

  const [submitting, setSubmitting] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [direction, setDirection] = useState(1)
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [scoreSummary, setScoreSummary] = useState<Record<string, { overall: number }> | null>(null)
  const [userDob, setUserDob] = useState<string | null>(null)
  const [userCulture, setUserCulture] = useState<string | null>(null)

  const questions = useMemo(
    () => getPersonalizedQuestions(moduleNum, userDob, userCulture),
    [moduleNum, userDob, userCulture]
  )
  const moduleConfig = MODULE_CONFIG[moduleNum - 1]
  const qIndex = currentIndex[moduleNum] ?? 0
  const currentQuestion = questions[qIndex]
  const answers = draftAnswers[moduleNum] ?? {}
  const answeredCount = Object.keys(answers).length
  const isLastQuestion = qIndex === questions.length - 1
  const allAnswered = answeredCount === questions.length

  // Fetch user profile for demographic question personalization
  useEffect(() => {
    if (!user || !supabase) return
    supabase
      .from('profiles')
      .select('date_of_birth, cultural_background')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setUserDob(data.date_of_birth ?? null)
          setUserCulture(data.cultural_background ?? null)
        }
      })
  }, [user?.id])

  // Validate module number
  if (!moduleConfig || questions.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center px-6">
          <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>Module not found.</p>
          <button
            onClick={() => router.push('/app/assessment')}
            className="mt-4 text-sm font-medium px-4 py-2 rounded-lg"
            style={{ color: 'var(--ciq-purple)' }}
          >
            Back to Assessment
          </button>
        </div>
      </div>
    )
  }

  // Reset selectedValue when question changes
  useEffect(() => {
    setSelectedValue(answers[currentQuestion?.id] ?? null)
  }, [qIndex, currentQuestion?.id])

  const handleSelect = (value: number) => {
    setSelectedValue(value)
    setAnswer(moduleNum, currentQuestion.id, value)

    if (!isLastQuestion) {
      // Auto-advance after brief delay
      setTimeout(() => {
        setDirection(1)
        setCurrentIndex(moduleNum, qIndex + 1)
      }, 350)
    } else {
      // Last question answered — auto-submit after a brief pause
      const updatedAnswers = { ...answers, [currentQuestion.id]: value }
      setTimeout(() => {
        submitModule(updatedAnswers)
      }, 500)
    }
  }

  const submitModule = async (finalAnswers: Record<string, number>) => {
    if (!user || submitting) return
    setSubmitting(true)

    // Show celebration immediately — don't wait for API
    setTimeout(() => {
      completeModule(moduleNum)
      setAssessmentProgress(moduleNum)
      clearDraft(moduleNum)
      setShowComplete(true)
    }, 800)

    // Fire-and-forget API call to store answers
    try {
      await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: moduleNum, answers: finalAnswers }),
      })
    } catch (err) {
      console.error('Assessment submit (background):', err)
    }
  }

  const goBack = () => {
    if (qIndex > 0) {
      setDirection(-1)
      setCurrentIndex(moduleNum, qIndex - 1)
    }
  }

  const goForward = () => {
    if (qIndex < questions.length - 1 && answers[currentQuestion.id] !== undefined) {
      setDirection(1)
      setCurrentIndex(moduleNum, qIndex + 1)
    }
  }

  // handleSubmit kept as fallback for the "Complete Module" button
  const handleSubmit = () => {
    submitModule(answers)
  }

  // ── Completion Celebration Screen ──
  if (showComplete) {
    return <CompletionScreen moduleNum={moduleNum} moduleConfig={moduleConfig} scoreSummary={scoreSummary} router={router} />
  }

  // ── Full-Screen Question Flow ──
  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={() => router.push('/app/assessment')}
            className="p-2 -ml-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Exit assessment"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--ciq-purple)' }}>
              Module {moduleNum}
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              {moduleConfig.title}
            </p>
          </div>
          <div className="w-9" />
        </div>

        {/* Progress bar */}
        <div className="max-w-lg mx-auto mt-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--ciq-purple)' }}
                initial={false}
                animate={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[11px] font-semibold tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {qIndex + 1}/{questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Question area -- fills remaining space */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-lg mx-auto py-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Dimension badge */}
              <div className="mb-4">
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--ciq-purple)',
                  }}
                >
                  {currentQuestion.dimension.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Question text */}
              <p className="text-xl sm:text-2xl font-semibold leading-relaxed mb-8" style={{ color: 'var(--text-primary)' }}>
                {currentQuestion.text}
              </p>

              {/* Response options */}
              <OptionsList
                question={currentQuestion}
                selectedValue={answers[currentQuestion.id]}
                onSelect={handleSelect}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex-shrink-0 px-4 pb-4 safe-area-bottom" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={qIndex === 0}
            className="flex items-center gap-1 px-3 py-2.5 text-sm rounded-lg disabled:opacity-30 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {isLastQuestion && allAnswered ? (
            <motion.button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--ciq-purple)' }}
              whileTap={{ scale: 0.97 }}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Scoring...
                </>
              ) : (
                <>
                  Complete Module
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </motion.button>
          ) : (
            <button
              onClick={goForward}
              disabled={answers[currentQuestion.id] === undefined}
              className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium rounded-lg disabled:opacity-30 transition-opacity"
              style={{ color: 'var(--ciq-purple)' }}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// Options List Component
// ═══════════════════════════════════════════

function OptionsList({
  question,
  selectedValue,
  onSelect,
}: {
  question: AssessmentQuestion
  selectedValue: number | undefined
  onSelect: (value: number) => void
}) {
  const { format, options } = question

  // For Likert scales, show a compact horizontal selector on 5-point scales
  if (format === 'likert' && options.length === 5) {
    return <LikertScale options={options} selectedValue={selectedValue} onSelect={onSelect} />
  }

  // For forced-choice (A/B pairs), show two large cards
  if (format === 'forced_choice' && options.length === 2) {
    return <ForcedChoicePair options={options} selectedValue={selectedValue} onSelect={onSelect} />
  }

  // Default: vertical option list (scenarios, multi-option, frequency)
  return (
    <div className="space-y-2.5">
      {options.map((opt, i) => {
        const isSelected = selectedValue === opt.value
        return (
          <motion.button
            key={opt.value}
            custom={i}
            variants={optionVariants}
            initial="hidden"
            animate="visible"
            onClick={() => onSelect(opt.value)}
            className="w-full text-left px-4 py-4 rounded-xl border text-base transition-all"
            style={{
              background: isSelected ? 'var(--ciq-purple)' : 'var(--bg-card)',
              borderColor: isSelected ? 'var(--ciq-purple)' : 'var(--border)',
              color: isSelected ? 'white' : 'var(--text-primary)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {opt.label}
          </motion.button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════
// Likert Scale Component
// ═══════════════════════════════════════════

function LikertScale({
  options,
  selectedValue,
  onSelect,
}: {
  options: { value: number; label: string }[]
  selectedValue: number | undefined
  onSelect: (value: number) => void
}) {
  return (
    <div>
      {/* Label row */}
      <div className="flex justify-between mb-3">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {options[0].label}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {options[options.length - 1].label}
        </span>
      </div>

      {/* Circle selectors */}
      <div className="flex justify-between items-center px-2">
        {options.map((opt, i) => {
          const isSelected = selectedValue === opt.value
          // Scale sizes: smallest on edges, largest in middle
          const sizes = [36, 40, 44, 40, 36]
          const size = sizes[i] ?? 40

          return (
            <motion.button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="rounded-full flex items-center justify-center transition-all font-semibold"
              style={{
                width: size,
                height: size,
                background: isSelected ? 'var(--ciq-purple)' : 'var(--bg-secondary)',
                color: isSelected ? 'white' : 'var(--text-muted)',
                border: isSelected ? '2px solid var(--ciq-purple)' : '2px solid var(--border)',
                fontSize: 13,
              }}
              whileTap={{ scale: 0.9 }}
              animate={isSelected ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {opt.value}
            </motion.button>
          )
        })}
      </div>

      {/* Center label */}
      <div className="text-center mt-2">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {options[2]?.label}
        </span>
      </div>

      {/* Selected label callout */}
      <AnimatePresence>
        {selectedValue !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mt-4"
          >
            <span
              className="inline-block text-sm font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--bg-secondary)', color: 'var(--ciq-purple)' }}
            >
              {options.find(o => o.value === selectedValue)?.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════
// Forced Choice Pair Component
// ═══════════════════════════════════════════

function ForcedChoicePair({
  options,
  selectedValue,
  onSelect,
}: {
  options: { value: number; label: string }[]
  selectedValue: number | undefined
  onSelect: (value: number) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((opt, i) => {
        const isSelected = selectedValue === opt.value
        return (
          <motion.button
            key={opt.value}
            custom={i}
            variants={optionVariants}
            initial="hidden"
            animate="visible"
            onClick={() => onSelect(opt.value)}
            className="w-full text-left p-5 rounded-2xl border-2 text-base leading-relaxed transition-all"
            style={{
              background: isSelected ? 'var(--ciq-purple)' : 'var(--bg-card)',
              borderColor: isSelected ? 'var(--ciq-purple)' : 'var(--border)',
              color: isSelected ? 'white' : 'var(--text-primary)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wider mb-2 px-2 py-0.5 rounded"
              style={{
                background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)',
                color: isSelected ? 'white' : 'var(--text-muted)',
              }}
            >
              Option {String.fromCharCode(65 + i)}
            </span>
            <p className="font-medium">{opt.label}</p>
          </motion.button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════
// Completion Screen
// ═══════════════════════════════════════════

function CompletionScreen({
  moduleNum,
  moduleConfig,
  scoreSummary,
  router,
}: {
  moduleNum: number
  moduleConfig: (typeof MODULE_CONFIG)[number]
  scoreSummary: Record<string, { overall: number }> | null
  router: ReturnType<typeof useRouter>
}) {
  const unlocked = getUnlockedProfileCount(moduleNum)
  const isFullComplete = moduleNum === MODULE_CONFIG.length

  // Confetti colors
  const confettiColors = ['var(--ciq-purple)', 'var(--ciq-green)', 'var(--ciq-coral)', '#FFD700', '#00BFFF']

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiColors.map((color, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={confettiVariants}
            initial="hidden"
            animate="visible"
            className="absolute left-1/2 top-1/3 w-3 h-3 rounded-sm"
            style={{ background: color }}
          />
        ))}
      </div>

      <motion.div
        variants={celebrationVariants}
        initial="hidden"
        animate="visible"
        className="text-center px-6 max-w-sm"
      >
        {/* Icon */}
        <motion.div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: isFullComplete ? 'var(--tier-rare, var(--ciq-purple))' : 'var(--ciq-green)',
            color: 'white',
          }}
          animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {isFullComplete ? <Sparkles className="w-9 h-9" /> : <CheckCircle2 className="w-9 h-9" />}
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {isFullComplete ? 'Assessment Complete!' : `${moduleConfig.title} -- Done!`}
        </h2>

        {/* Subtitle */}
        <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
          {isFullComplete
            ? 'Your Compatibility Index Score has been calculated. All matches are now unlocked.'
            : `${unlocked === null ? 'All remaining' : `+${moduleConfig.unlockCount}`} compatible profiles unlocked.`}
        </p>

        {/* Score preview (if available) */}
        {scoreSummary && Object.keys(scoreSummary).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 p-4 rounded-2xl"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Your Dimension Scores
            </p>
            <div className="space-y-2">
              {Object.entries(scoreSummary).map(([dimId, data]) => {
                const percent = Math.round((data.overall / 5) * 100)
                return (
                  <div key={dimId} className="flex items-center gap-3">
                    <span className="text-xs flex-shrink-0 w-28 text-right capitalize" style={{ color: 'var(--text-secondary)' }}>
                      {dimId.replace(/_/g, ' ')}
                    </span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'var(--ciq-purple)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs font-semibold tabular-nums w-8" style={{ color: 'var(--text-primary)' }}>
                      {data.overall.toFixed(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          onClick={() => router.push(isFullComplete ? '/app/discover' : '/app/assessment')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--ciq-purple)' }}
          whileTap={{ scale: 0.97 }}
        >
          {isFullComplete ? 'See Your Matches' : 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  )
}
