// CompatibleIQ -- CIS Scoring Engine Constants
// Dimension weights, tier thresholds, and configuration

import type {
  DimensionId,
  CompatibilityType,
  ConflictApproach,
  LoveLanguage,
} from './types'

// ═══════════════════════════════════════════
// Dimension Configuration
// ═══════════════════════════════════════════

export interface DimensionConfig {
  id: DimensionId
  name: string
  /** Weight out of 100 for the overall CIS */
  weight: number
  compatibilityType: CompatibilityType
  /** Sub-scale IDs within this dimension */
  subScales: string[]
  /** Question IDs that are reverse-scored */
  reverseItems: string[]
}

export const DIMENSION_CONFIGS: Record<DimensionId, DimensionConfig> = {
  values: {
    id: 'values',
    name: 'Values & Priorities',
    weight: 20,
    compatibilityType: 'similarity',
    subScales: ['life_direction', 'moral_ethical', 'relationship_priority'],
    reverseItems: ['val_12', 'val_14'],
  },
  attachment: {
    id: 'attachment',
    name: 'Attachment Style',
    weight: 20,
    compatibilityType: 'complementary_with_guardrails',
    subScales: ['anxiety', 'avoidance', 'security'],
    reverseItems: ['att_05', 'att_10', 'att_15'],
  },
  communication: {
    id: 'communication',
    name: 'Communication & Conflict',
    weight: 18,
    compatibilityType: 'complementarity',
    subScales: ['conflict_approach', 'repair_attempts', 'emotional_expression'],
    reverseItems: ['com_03', 'com_09', 'com_12', 'com_14'],
  },
  emotional_intelligence: {
    id: 'emotional_intelligence',
    name: 'Emotional Intelligence',
    weight: 16,
    compatibilityType: 'similarity_with_floor',
    subScales: ['self_awareness', 'empathy', 'emotional_regulation'],
    reverseItems: ['ei_03', 'ei_08', 'ei_12'],
  },
  lifestyle_ambition: {
    id: 'lifestyle_ambition',
    name: 'Lifestyle & Ambition',
    weight: 14,
    compatibilityType: 'similarity',
    subScales: ['pace_of_life', 'social_energy', 'future_orientation'],
    reverseItems: ['la_03', 'la_07', 'la_08', 'la_12', 'la_15'],
  },
  love_languages: {
    id: 'love_languages',
    name: 'Love Languages',
    weight: 12,
    compatibilityType: 'complementarity',
    subScales: ['receiving_language', 'giving_language', 'language_flexibility'],
    reverseItems: ['ll_12', 'll_15'],
  },
} as const

// ═══════════════════════════════════════════
// CIS Tier Thresholds
// ═══════════════════════════════════════════

export const CIS_TIER_THRESHOLDS = {
  rare: { min: 90, max: 100, label: 'Rare Match' },
  synergistic: { min: 75, max: 89, label: 'Synergistic' },
  compatible: { min: 60, max: 74, label: 'Compatible' },
  misaligned: { min: 0, max: 59, label: 'Misaligned' },
} as const

/** Minimum CIS score to be shown as a match */
export const MATCH_THRESHOLD = 60

// ═══════════════════════════════════════════
// Emotional Intelligence Floor
// ═══════════════════════════════════════════

/** If either user scores below this on EI, a penalty is applied */
export const EI_FLOOR_THRESHOLD = 2.5

/** Multiplier applied when the EI floor is triggered */
export const EI_FLOOR_PENALTY = 0.6

// ═══════════════════════════════════════════
// Attachment Style Thresholds
// ═══════════════════════════════════════════

/** Score >= this on a sub-scale is considered "high" */
export const ATTACHMENT_HIGH_THRESHOLD = 3.5

/** Bonus applied when either partner is securely attached */
export const SECURE_BONUS = 0.20

/** Bonus applied when BOTH partners are securely attached */
export const BOTH_SECURE_BONUS = 0.30

/** Penalty applied for the anxious-avoidant trap (pursue-withdraw cycle) */
export const ANXIOUS_AVOIDANT_PENALTY = 0.35

/** Maximum score cap when either partner is fearful-avoidant */
export const FEARFUL_AVOIDANT_CAP = 0.70

// ═══════════════════════════════════════════
// Communication Scoring
// ═══════════════════════════════════════════

/** Sub-scale weights within Communication dimension */
export const COMMUNICATION_WEIGHTS = {
  conflict_approach: 0.30,
  repair_attempts: 0.45,
  emotional_expression: 0.25,
} as const

/**
 * Conflict approach pairing scores based on Gottman outcome data.
 * Keyed as "styleA_styleB" -- order-independent (we check both orders).
 */
export const CONFLICT_PAIRING_SCORES: Record<string, number> = {
  // Same-style pairings
  collaborator_collaborator: 0.90,
  confronter_confronter: 0.35,
  avoider_avoider: 0.30,
  accommodator_accommodator: 0.55,
  // Cross-style pairings
  confronter_collaborator: 0.75,
  collaborator_confronter: 0.75,
  avoider_collaborator: 0.70,
  collaborator_avoider: 0.70,
  confronter_avoider: 0.55,
  avoider_confronter: 0.55,
  confronter_accommodator: 0.60,
  accommodator_confronter: 0.60,
  avoider_accommodator: 0.50,
  accommodator_avoider: 0.50,
  collaborator_accommodator: 0.65,
  accommodator_collaborator: 0.65,
  // Unclassified defaults
  unclassified_unclassified: 0.50,
}

/** Penalty applied when either partner scores >= 4 on com_05 (contempt/hostility) */
export const HORSEMAN_PENALTY = 0.10

/** Threshold for com_05 that triggers the horseman penalty */
export const HORSEMAN_THRESHOLD = 4

// ═══════════════════════════════════════════
// Values Dimension Weights
// ═══════════════════════════════════════════

export const VALUES_SUB_SCALE_WEIGHTS = {
  life_direction: 0.35,
  moral_ethical: 0.30,
  relationship_priority: 0.35,
} as const

// ═══════════════════════════════════════════
// Lifestyle Dimension Weights
// ═══════════════════════════════════════════

/** Overall dimension similarity vs. sub-scale mean similarity split */
export const LIFESTYLE_DIMENSION_WEIGHT = 0.40
export const LIFESTYLE_SUBSCALE_WEIGHT = 0.60

// ═══════════════════════════════════════════
// Love Language Scoring
// ═══════════════════════════════════════════

/** Base scores for give-receive cross-matching */
export const LOVE_LANG_MATCH_SCORES = {
  /** Both directions match (A gives what B needs AND B gives what A needs) */
  fullMatch: 1.0,
  /** Only one direction matches */
  oneDirectionMatch: 0.6,
  /** No match in either direction */
  noMatch: 0.2,
} as const

/** Flexibility modifier range: final = base * (BASE_WEIGHT + FLEX_WEIGHT * flexibility_mod) */
export const LOVE_LANG_BASE_WEIGHT = 0.6
export const LOVE_LANG_FLEX_WEIGHT = 0.4

// ═══════════════════════════════════════════
// Question-to-Language Mappings (Forced Choice)
// ═══════════════════════════════════════════

/** Maps forced-choice question IDs to the two love languages in each pair */
export const RECEIVING_LANGUAGE_PAIRS: Record<string, [LoveLanguage, LoveLanguage]> = {
  ll_01: ['words_of_affirmation', 'quality_time'],
  ll_02: ['receiving_gifts', 'physical_touch'],
  ll_03: ['acts_of_service', 'words_of_affirmation'],
  ll_04: ['physical_touch', 'acts_of_service'],
  ll_05: ['quality_time', 'receiving_gifts'],
}

export const GIVING_LANGUAGE_PAIRS: Record<string, [LoveLanguage, LoveLanguage]> = {
  ll_06: ['words_of_affirmation', 'acts_of_service'],
  ll_07: ['receiving_gifts', 'words_of_affirmation'],
  ll_08: ['quality_time', 'physical_touch'],
  ll_09: ['quality_time', 'receiving_gifts'],
  ll_10: ['physical_touch', 'acts_of_service'],
}

// ═══════════════════════════════════════════
// Likert Scale Constants
// ═══════════════════════════════════════════

/** Maximum value on the Likert scale */
export const LIKERT_MAX = 5

/** Minimum value on the Likert scale */
export const LIKERT_MIN = 1

/** Maximum possible difference between two scores on a 1-5 scale */
export const MAX_LIKERT_DIFFERENCE = LIKERT_MAX - LIKERT_MIN // = 4

/** Reverse-scoring formula: reversed = REVERSE_CONSTANT - raw */
export const REVERSE_CONSTANT = 6

// ═══════════════════════════════════════════
// Sub-scale question mappings
// ═══════════════════════════════════════════

/** Maps sub-scale IDs to their question IDs across all dimensions */
export const SUB_SCALE_QUESTIONS: Record<string, string[]> = {
  // Values
  life_direction: ['val_01', 'val_02', 'val_03', 'val_04', 'val_05'],
  moral_ethical: ['val_06', 'val_07', 'val_08', 'val_09', 'val_10'],
  relationship_priority: ['val_11', 'val_12', 'val_13', 'val_14', 'val_15'],
  // Attachment
  anxiety: ['att_01', 'att_02', 'att_03', 'att_04', 'att_05'],
  avoidance: ['att_06', 'att_07', 'att_08', 'att_09', 'att_10'],
  security: ['att_11', 'att_12', 'att_13', 'att_14', 'att_15'],
  // Communication
  conflict_approach: ['com_01', 'com_02', 'com_03', 'com_04', 'com_05'],
  repair_attempts: ['com_06', 'com_07', 'com_08', 'com_09', 'com_10'],
  emotional_expression: ['com_11', 'com_12', 'com_13', 'com_14', 'com_15'],
  // Emotional Intelligence
  self_awareness: ['ei_01', 'ei_02', 'ei_03', 'ei_04', 'ei_05'],
  empathy: ['ei_06', 'ei_07', 'ei_08', 'ei_09', 'ei_10'],
  emotional_regulation: ['ei_11', 'ei_12', 'ei_13', 'ei_14', 'ei_15'],
  // Lifestyle & Ambition
  pace_of_life: ['la_01', 'la_02', 'la_03', 'la_04', 'la_05'],
  social_energy: ['la_06', 'la_07', 'la_08', 'la_09', 'la_10'],
  future_orientation: ['la_11', 'la_12', 'la_13', 'la_14', 'la_15'],
  // Love Languages
  receiving_language: ['ll_01', 'll_02', 'll_03', 'll_04', 'll_05'],
  giving_language: ['ll_06', 'll_07', 'll_08', 'll_09', 'll_10'],
  language_flexibility: ['ll_11', 'll_12', 'll_13', 'll_14', 'll_15'],
}
