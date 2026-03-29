// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAssessmentStore } from '@/store/assessment-store'
import { MODULE_CONFIG, getUnlockedProfileCount } from '@/lib/constants'
import { CheckCircle2, Lock, Clock, ChevronRight, Users } from 'lucide-react'

export default function AssessmentHub() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const { completedModules, setAssessmentProgress, assessmentProgress } = useAssessmentStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !supabase) return
    supabase
      .from('profiles')
      .select('assessment_progress')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const row = data as { assessment_progress: number } | null
        if (row) setAssessmentProgress(row.assessment_progress)
        setLoading(false)
      })
  }, [user, supabase, setAssessmentProgress])

  const progress = Math.max(assessmentProgress, completedModules.length)
  const totalQuestions = MODULE_CONFIG.reduce((sum, m) => sum + m.questionCount, 0)
  const completedQuestions = MODULE_CONFIG.filter((_, i) => i < progress).reduce((sum, m) => sum + m.questionCount, 0)
  const percentComplete = Math.round((completedQuestions / totalQuestions) * 100)
  const unlocked = getUnlockedProfileCount(progress)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Progress header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Your Assessment
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          {progress === 6
            ? 'Assessment complete — all matches unlocked'
            : `${percentComplete}% complete — ${unlocked === null ? 'all' : unlocked} profiles unlocked`}
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%`, background: 'var(--ciq-purple)' }}
          />
        </div>

        {/* Profiles unlocked badge */}
        {unlocked !== null && unlocked > 0 && progress < 6 && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mt-4"
            style={{ background: 'var(--bg-secondary)', color: 'var(--ciq-green)' }}
          >
            <Users className="w-3.5 h-3.5" />
            {unlocked} compatible profiles waiting
          </div>
        )}
      </div>

      {/* Module cards */}
      <div className="space-y-3">
        {MODULE_CONFIG.map((mod, idx) => {
          const isCompleted = idx < progress
          const isCurrent = idx === progress
          const isLocked = idx > progress

          return (
            <div key={mod.module}>
              {isCurrent ? (
                <Link href={`/app/assessment/${mod.module}`} className="block">
                  <ModuleCard mod={mod} status="current" />
                </Link>
              ) : isCompleted ? (
                <Link href={`/app/assessment/${mod.module}`} className="block">
                  <ModuleCard mod={mod} status="completed" />
                </Link>
              ) : (
                <ModuleCard mod={mod} status="locked" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ModuleCard({ mod, status }: {
  mod: (typeof MODULE_CONFIG)[number]
  status: 'completed' | 'current' | 'locked'
}) {
  const unlockLabel = mod.unlockCount === -1 ? 'All remaining' : `+${mod.unlockCount}`

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl border transition-all"
      style={{
        background: status === 'current' ? 'var(--bg-card)' : 'var(--bg-secondary)',
        borderColor: status === 'current' ? 'var(--ciq-purple)' : 'var(--border)',
        opacity: status === 'locked' ? 0.5 : 1,
      }}
    >
      {/* Status icon */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: status === 'completed' ? 'var(--ciq-green)' : status === 'current' ? 'var(--ciq-purple)' : 'var(--border)',
          color: 'white',
        }}
      >
        {status === 'completed' ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : status === 'locked' ? (
          <Lock className="w-4 h-4" />
        ) : (
          <span className="text-sm font-bold">{mod.module}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {mod.title}
        </h3>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {mod.subtitle}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <Clock className="w-3 h-3" /> ~{mod.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--ciq-purple)' }}>
            <Users className="w-3 h-3" /> {unlockLabel} profiles
          </span>
        </div>
      </div>

      {/* Arrow */}
      {status !== 'locked' && (
        <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
      )}
    </div>
  )
}
