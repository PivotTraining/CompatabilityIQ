'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAssessmentStore } from '@/store/assessment-store'
import { getModuleQuestions } from '@/lib/assessment/question-bank'
import { MODULE_CONFIG, getUnlockedProfileCount } from '@/lib/constants'
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AssessmentQuestion } from '@/lib/assessment/types'

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

  const questions = useMemo(() => getModuleQuestions(moduleNum), [moduleNum])
  const moduleConfig = MODULE_CONFIG[moduleNum - 1]
  const qIndex = currentIndex[moduleNum] ?? 0
  const currentQuestion = questions[qIndex]
  const answers = draftAnswers[moduleNum] ?? {}
  const answeredCount = Object.keys(answers).length
  const isLastQuestion = qIndex === questions.length - 1
  const allAnswered = answeredCount === questions.length

  const [submitting, setSubmitting] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [direction, setDirection] = useState(1)

  // Validate module number
  if (!moduleConfig || questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <p style={{ color: 'var(--text-secondary)' }}>Module not found.</p>
      </div>
    )
  }

  const handleSelect = (value: number) => {
    setAnswer(moduleNum, currentQuestion.id, value)
    // Auto-advance after short delay
    if (!isLastQuestion) {
      setTimeout(() => {
        setDirection(1)
        setCurrentIndex(moduleNum, qIndex + 1)
      }, 300)
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

  const handleSubmit = async () => {
    if (!user || !allAnswered) return
    setSubmitting(true)

    try {
      // Submit answers to API (which forwards to Edge Function)
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: moduleNum,
          answers,
        }),
      })

      if (!res.ok) throw new Error('Submission failed')

      const result = await res.json()

      // Update local state
      completeModule(moduleNum)
      setAssessmentProgress(moduleNum)
      clearDraft(moduleNum)

      // Show completion celebration
      setShowComplete(true)
    } catch (err) {
      console.error('Assessment submission error:', err)
      setSubmitting(false)
    }
  }

  if (showComplete) {
    const unlocked = getUnlockedProfileCount(moduleNum)
    const isFullComplete = moduleNum === 6
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: isFullComplete ? 'var(--tier-rare)' : 'var(--ciq-green)', color: 'white' }}
          >
            {isFullComplete ? <Sparkles className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {isFullComplete ? 'Assessment Complete!' : `${moduleConfig.title} — Done!`}
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            {isFullComplete
              ? 'Your Compatibility Index Score has been calculated. All matches are now unlocked.'
              : `${unlocked === null ? 'All remaining' : `+${moduleConfig.unlockCount}`} compatible profiles unlocked.`}
          </p>
          <button
            onClick={() => router.push(isFullComplete ? '/app/discover' : '/app/assessment')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--ciq-purple)' }}
          >
            {isFullComplete ? 'See Your Matches' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/app/assessment')}
          className="p-2 -ml-2 rounded-lg"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold" style={{ color: 'var(--ciq-purple)' }}>
            MODULE {moduleNum}
          </p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {moduleConfig.title}
          </p>
        </div>
        <div className="w-9" />
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((qIndex + 1) / questions.length) * 100}%`,
              background: 'var(--ciq-purple)',
            }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {qIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQuestion.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-base font-medium leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
            {currentQuestion.text}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all"
                  style={{
                    background: isSelected ? 'var(--ciq-purple)' : 'var(--bg-card)',
                    borderColor: isSelected ? 'var(--ciq-purple)' : 'var(--border)',
                    color: isSelected ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={goBack}
          disabled={qIndex === 0}
          className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg disabled:opacity-30"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {isLastQuestion && allAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--ciq-purple)' }}
          >
            {submitting ? 'Scoring...' : 'Complete Module'}
            {!submitting && <CheckCircle2 className="w-4 h-4" />}
          </button>
        ) : (
          <button
            onClick={goForward}
            disabled={answers[currentQuestion.id] === undefined}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg disabled:opacity-30"
            style={{ color: 'var(--ciq-purple)' }}
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
