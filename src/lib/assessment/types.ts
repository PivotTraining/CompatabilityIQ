export type QuotientKey =
  | 'VP' | 'AS' | 'CC' | 'LL' | 'HT'
  | 'EI' | 'LA' | 'IC'

export type QuestionFormat = 'likert' | 'forced_choice' | 'scenario' | 'multi_select' | 'frequency'

export interface AssessmentOption {
  value: number
  label: string
}

export interface AssessmentQuestion {
  id: string
  module: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  quotient: QuotientKey
  dimension: string
  text: string
  options: AssessmentOption[]
  format: QuestionFormat
  /** For LL: distinguishes giving vs receiving */
  subtype?: 'give' | 'receive'
  /** If true, high values indicate risk or reverse direction */
  reverseScored?: boolean
  /** Whether this module is a paid add-on */
  paid?: boolean
  /** Price in USD for the paid module this question belongs to */
  price?: number
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
