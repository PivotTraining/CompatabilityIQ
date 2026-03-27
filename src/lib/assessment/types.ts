export type QuotientKey =
  | 'VQ' | 'AQ' | 'EQ' | 'CQ' | 'NQ' | 'LQ' | 'GQ' | 'CSQ'
  | 'FMI' | 'FSB' | 'FPL' | 'FIQ' | 'FCM' | 'CDF'
  | 'ACC' | 'EMP' | 'STB' | 'SAF' | 'DEP'

export type QuestionFormat = 'likert' | 'forced_choice' | 'scenario' | 'multi_select' | 'frequency'

export interface AssessmentOption {
  value: number
  label: string
}

export interface AssessmentQuestion {
  id: string
  module: 1 | 2 | 3 | 4 | 5 | 6
  quotient: QuotientKey
  dimension: string
  text: string
  options: AssessmentOption[]
  format: QuestionFormat
  /** For LQ: distinguishes giving vs receiving */
  subtype?: 'give' | 'receive'
  /** If true, high values indicate risk (for shadow clusters) */
  reverseScored?: boolean
}

export interface ModuleSubmission {
  module: number
  answers: Record<string, number>
  completedAt: string
}

export interface ScoringResult {
  module: number
  completed: boolean
  profilesUnlocked: number
  cisScore?: number
  cisTier?: string
}
