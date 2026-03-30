// CompatibleIQ -- Answer Mapper
// Maps question IDs from the question-bank format (m1_vq_01) to the
// scoring-engine format (val_01) so the CIS engine can process them.
//
// The question-bank uses module-prefixed IDs: m{module}_{quotient}_{num}
// The scoring engine uses dimension-prefixed IDs: {dimension_prefix}_{num}

import type { DimensionId } from '@/lib/scoring/types'

// ═══════════════════════════════════════════
// Quotient -> Dimension ID mapping
// ═══════════════════════════════════════════

/**
 * Maps quotient keys (from question-bank) to dimension IDs (for scoring engine).
 * Each module can span multiple quotients; the scoring engine groups by dimension.
 */
const QUOTIENT_TO_DIMENSION: Record<string, DimensionId> = {
  VQ: 'values',
  AQ: 'attachment',
  CQ: 'communication',
  EQ: 'emotional_intelligence',
  NQ: 'emotional_intelligence', // NQ items contribute to EI dimension's sub-scales
  LQ: 'how_you_love',
  GQ: 'lifestyle_ambition', // GQ items map to lifestyle/ambition dimension
  CSQ: 'communication', // CSQ items contribute to communication dimension
  // Layer 2 & 3 don't map to the 6-dimension scoring engine directly
  FMI: 'lifestyle_ambition',
  FSB: 'lifestyle_ambition',
  FPL: 'lifestyle_ambition',
  FIQ: 'lifestyle_ambition',
  FCM: 'communication',
  CDF: 'lifestyle_ambition',
  // Shadow clusters (Layer 3) -- stored but not scored in CIS dimensions
  ACC: 'values', // fallback; shadow items are scored separately
  EMP: 'values',
  STB: 'attachment',
  SAF: 'attachment',
  DEP: 'attachment',
}

// ═══════════════════════════════════════════
// Question-bank ID -> Scoring Engine ID mapping
// ═══════════════════════════════════════════

/**
 * Maps module question-bank IDs to the scoring-engine IDs used in
 * the CIS engine's SUB_SCALE_QUESTIONS constants.
 *
 * Pattern: m{module}_{quotient}_{seq} -> {dimension_prefix}_{seq_padded}
 *
 * Module 1: m1_vq_01..14 -> val_01..14 (VQ), m1_gq_01..10 -> la_11..15 (GQ maps to lifestyle future_orientation sub-scale)
 * Module 2: m2_aq_01..12 -> att_01..12 (AQ), m2_lq_01..10 -> ll_01..10 (LQ)
 * Module 3: m3_eq_01..14 -> ei_01..14 (EQ), m3_nq_01..12 -> (NQ -- separate scoring)
 * Module 4: m4_cq_01..12 -> com_01..12 (CQ), m4_csq_01..08 -> (CSQ -- separate scoring)
 * Module 5: Shadow clusters -- m5_acc..dep -> stored as-is
 * Module 6: Financial -- m6_fmi..cdf -> stored as-is
 */
const QUESTION_ID_MAP: Record<string, string> = {}

// Module 1 -> Values (VQ) maps to val_01..val_15
// The question-bank has 14 VQ items mapping to 3 sub-scales of the values dimension
// We map m1_vq_01..05 -> val_01..05 (life_direction)
// m1_vq_06..08 -> val_06..08 (moral_ethical / benevolence_universalism)
// etc.
for (let i = 1; i <= 14; i++) {
  const padded = String(i).padStart(2, '0')
  QUESTION_ID_MAP[`m1_vq_${padded}`] = `val_${padded}`
}
// Module 1 GQ items -> lifestyle dimension sub-scales
// m1_gq_01..10 map to la_01..la_10 (these cover pace_of_life and future_orientation)
for (let i = 1; i <= 10; i++) {
  const padded = String(i).padStart(2, '0')
  QUESTION_ID_MAP[`m1_gq_${padded}`] = `la_${padded}`
}

// Module 2 -> Attachment (AQ) maps to att_01..att_15
for (let i = 1; i <= 12; i++) {
  const padded = String(i).padStart(2, '0')
  QUESTION_ID_MAP[`m2_aq_${padded}`] = `att_${padded}`
}
// Module 2 -> How You Love (LQ) maps to ll_01..ll_15
for (let i = 1; i <= 10; i++) {
  const padded = String(i).padStart(2, '0')
  QUESTION_ID_MAP[`m2_lq_${padded}`] = `ll_${padded}`
}

// Module 3 -> Emotional Intelligence (EQ) maps to ei_01..ei_15
for (let i = 1; i <= 14; i++) {
  const padded = String(i).padStart(2, '0')
  QUESTION_ID_MAP[`m3_eq_${padded}`] = `ei_${padded}`
}
// Module 3 -> Neurobiological (NQ) -- store with nq_ prefix for potential future scoring
for (let i = 1; i <= 12; i++) {
  const padded = String(i).padStart(2, '0')
  QUESTION_ID_MAP[`m3_nq_${padded}`] = `nq_${padded}`
}

// Module 4 -> Communication (CQ) maps to com_01..com_15
for (let i = 1; i <= 12; i++) {
  const padded = String(i).padStart(2, '0')
  QUESTION_ID_MAP[`m4_cq_${padded}`] = `com_${padded}`
}
// Module 4 -> Cognitive Style (CSQ) -- store with csq_ prefix
for (let i = 1; i <= 8; i++) {
  const padded = String(i).padStart(2, '0')
  QUESTION_ID_MAP[`m4_csq_${padded}`] = `csq_${padded}`
}

// Module 5 -> Shadow clusters (ACC, EMP, STB, SAF, DEP) -- keep original prefixes
const SHADOW_QUOTIENTS = ['acc', 'emp', 'stb', 'saf', 'dep']
const SHADOW_COUNTS: Record<string, number> = { acc: 6, emp: 5, stb: 5, saf: 6, dep: 6 }
for (const q of SHADOW_QUOTIENTS) {
  const count = SHADOW_COUNTS[q]
  for (let i = 1; i <= count; i++) {
    const padded = String(i).padStart(2, '0')
    QUESTION_ID_MAP[`m5_${q}_${padded}`] = `${q}_${padded}`
  }
}

// Module 6 -> Financial (FMI, FSB, FPL, FIQ, FCM, CDF) -- keep original prefixes
const FINANCIAL_QUOTIENTS = ['fmi', 'fsb', 'fpl', 'fiq', 'fcm', 'cdf']
const FINANCIAL_COUNTS: Record<string, number> = { fmi: 4, fsb: 4, fpl: 4, fiq: 3, fcm: 4, cdf: 3 }
for (const q of FINANCIAL_QUOTIENTS) {
  const count = FINANCIAL_COUNTS[q]
  for (let i = 1; i <= count; i++) {
    const padded = String(i).padStart(2, '0')
    QUESTION_ID_MAP[`m6_${q}_${padded}`] = `${q}_${padded}`
  }
}

// ═══════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════

/**
 * Convert a single module's answers from question-bank IDs to scoring-engine IDs.
 * Input:  { "m1_vq_01": 4, "m1_vq_02": 3, ... }
 * Output: { "val_01": 4, "val_02": 3, ... }
 */
export function mapModuleAnswers(
  answers: Record<string, number>
): Record<string, number> {
  const mapped: Record<string, number> = {}
  for (const [qbId, value] of Object.entries(answers)) {
    const scoringId = QUESTION_ID_MAP[qbId]
    if (scoringId) {
      mapped[scoringId] = value
    } else {
      // Pass through unmapped IDs (shouldn't happen, but safe fallback)
      mapped[qbId] = value
    }
  }
  return mapped
}

/**
 * Merge multiple modules' mapped answers into a single flat record.
 * This is what the scoring engine needs: all answers keyed by scoring-engine IDs.
 */
export function mergeAllModuleAnswers(
  moduleAnswers: Record<number, Record<string, number>>
): Record<string, number> {
  const merged: Record<string, number> = {}
  for (const [moduleNum, answers] of Object.entries(moduleAnswers)) {
    const mapped = mapModuleAnswers(answers)
    Object.assign(merged, mapped)
  }
  return merged
}

/**
 * Get the scoring-engine ID for a given question-bank ID.
 * Returns undefined if no mapping exists.
 */
export function getScoringId(questionBankId: string): string | undefined {
  return QUESTION_ID_MAP[questionBankId]
}

/**
 * Get the dimension that a module's quotient maps to.
 */
export function getDimensionForQuotient(quotientKey: string): DimensionId | undefined {
  return QUOTIENT_TO_DIMENSION[quotientKey]
}

/**
 * Which scoring-engine dimensions are covered by a given module number.
 */
export function getDimensionsForModule(moduleNum: number): DimensionId[] {
  const MODULE_DIMENSIONS: Record<number, DimensionId[]> = {
    1: ['values', 'lifestyle_ambition'],
    2: ['attachment', 'how_you_love'],
    3: ['emotional_intelligence'],
    4: ['communication'],
    5: [], // Shadow clusters -- not scored via CIS dimensions
    6: ['lifestyle_ambition'], // Financial items folded into lifestyle
  }
  return MODULE_DIMENSIONS[moduleNum] ?? []
}
