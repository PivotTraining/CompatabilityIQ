// CompatibleIQ -- Answer Mapper
// Maps module numbers to scoring-engine dimension IDs.
//
// The question-bank uses IDs like: m1_vp_01, m2_as_01, m3_cc_01, etc.
// The scoring engine's SUB_SCALE_QUESTIONS uses the SAME IDs.
// So no ID remapping is needed — answers pass through as-is.

import type { DimensionId } from '@/lib/scoring/types'

// ═══════════════════════════════════════════
// Module → Dimension mapping
// ═══════════════════════════════════════════

/**
 * Which scoring-engine dimensions are covered by a given module number.
 * Aligned with the actual question-bank modules:
 *   Module 1: VP (Values & Priorities)
 *   Module 2: AS (Attachment Style)
 *   Module 3: CC (Communication & Conflict)
 *   Module 4: LL (How You Connect)
 *   Module 5: HT (Hot Takes & Dealbreakers)
 *   Module 6: EI (Emotional Intelligence)
 */
const MODULE_DIMENSIONS: Record<number, DimensionId[]> = {
  1: ['values'],
  2: ['attachment'],
  3: ['communication'],
  4: ['how_you_love'],
  5: ['hot_takes'],
  6: ['emotional_intelligence'],
}

export function getDimensionsForModule(moduleNum: number): DimensionId[] {
  return MODULE_DIMENSIONS[moduleNum] ?? []
}

// ═══════════════════════════════════════════
// Answer mapping (pass-through)
// ═══════════════════════════════════════════

/**
 * Convert a single module's answers from question-bank IDs to scoring-engine IDs.
 * Since the question-bank IDs (m1_vp_01) match SUB_SCALE_QUESTIONS exactly,
 * this is a pass-through — no remapping needed.
 */
export function mapModuleAnswers(
  answers: Record<string, number>
): Record<string, number> {
  // Pass through — question-bank IDs ARE the scoring-engine IDs
  return { ...answers }
}

/**
 * Merge multiple modules' mapped answers into a single flat record.
 */
export function mergeAllModuleAnswers(
  moduleAnswers: Record<number, Record<string, number>>
): Record<string, number> {
  const merged: Record<string, number> = {}
  for (const answers of Object.values(moduleAnswers)) {
    Object.assign(merged, answers)
  }
  return merged
}

/**
 * Get the scoring-engine ID for a given question-bank ID.
 * Since IDs are the same, this is identity.
 */
export function getScoringId(questionBankId: string): string {
  return questionBankId
}

/**
 * Get the dimension that a module's quotient maps to.
 */
export function getDimensionForQuotient(quotientKey: string): DimensionId | undefined {
  const QUOTIENT_TO_DIMENSION: Record<string, DimensionId> = {
    VP: 'values',
    AS: 'attachment',
    CC: 'communication',
    LL: 'how_you_love',
    HT: 'hot_takes',
    EI: 'emotional_intelligence',
  }
  return QUOTIENT_TO_DIMENSION[quotientKey]
}
