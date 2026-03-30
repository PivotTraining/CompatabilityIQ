// @ts-nocheck -- pending schema regen
// CompatibleIQ -- CIS Scoring Engine Constants
// Dimension weights, tier thresholds, and configuration
// Updated for 5 free + 3 paid module structure

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
  /** Whether this is a paid add-on dimension */
  paid: boolean
  /** Price in USD if paid */
  price?: number
}

export const DIMENSION_CONFIGS: Record<DimensionId, DimensionConfig> = {
  values_priorities: {
    id: 'values_priorities',
    name: 'Values & Priorities',
    weight: 18,
    compatibilityType: 'similarity',
    subScales: ['life_direction', 'moral_flexibility', 'relationship_priority'],
    reverseItems: [],
    paid: false,
  },
  attachment_style: {
    id: 'attachment_style',
    name: 'Attachment Style',
    weight: 20,
    compatibilityType: 'complementary_with_guardrails',
    subScales: ['anxiety', 'avoidance', 'security'],
    reverseItems: [],
    paid: false,
  },
  communication_conflict: {
    id: 'communication_conflict',
    name: 'Communication & Conflict',
    weight: 17,
    compatibilityType: 'complementarity',
    subScales: ['conflict_style', 'repair_capacity', 'emotional_expression'],
    reverseItems: [],
    paid: false,
  },
  how_you_love: {
    id: 'how_you_love',
    name: 'How You Love',
    weight: 12,
    compatibilityType: 'complementarity',
    subScales: ['receiving_language', 'giving_language'],
    reverseItems: [],
    paid: false,
  },
  hot_takes_dealbreakers: {
    id: 'hot_takes_dealbreakers',
    name: 'Hot Takes & Dealbreakers',
    weight: 8,
    compatibilityType: 'similarity',
    subScales: ['boundaries', 'gender_dynamics', 'vulnerability'],
    reverseItems: [],
    paid: false,
  },
  emotional_intelligence: {
    id: 'emotional_intelligence',
    name: 'Emotional Intelligence',
    weight: 10,
    compatibilityType: 'similarity_with_floor',
    subScales: ['self_awareness', 'empathy', 'emotional_regulation'],
    reverseItems: [],
    paid: true,
    price: 4.99,
  },
  lifestyle_ambition: {
    id: 'lifestyle_ambition',
    name: 'Lifestyle & Ambition',
    weight: 8,
    compatibilityType: 'similarity',
    subScales: ['pace_of_life', 'social_energy', 'future_vision'],
    reverseItems: [],
    paid: true,
    price: 4.99,
  },
  intimacy_chemistry: {
    id: 'intimacy_chemistry',
    name: 'Intimacy & Chemistry',
    weight: 7,
    compatibilityType: 'similarity',
    subScales: ['physical_chemistry', 'emotional_intimacy', 'desire_dynamics'],
    reverseItems: [],
    paid: true,
    price: 4.99,
  },
} as const

// Total free weight: 18 + 20 + 17 + 12 + 8 = 75
// Total paid weight: 10 + 8 + 7 = 25
// Grand total: 100

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
  conflict_style: 0.30,
  repair_capacity: 0.45,
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

/** Penalty applied when either partner scores >= 4 on m3_cc_02 (contempt/hostility) */
export const HORSEMAN_PENALTY = 0.10

/** Threshold for m3_cc_02 that triggers the horseman penalty */
export const HORSEMAN_THRESHOLD = 4

// ═══════════════════════════════════════════
// Values Dimension Weights
// ═══════════════════════════════════════════

export const VALUES_SUB_SCALE_WEIGHTS = {
  life_direction: 0.35,
  moral_flexibility: 0.30,
  relationship_priority: 0.35,
} as const

// ═══════════════════════════════════════════
// Lifestyle Dimension Weights
// ═══════════════════════════════════════════

/** Overall dimension similarity vs. sub-scale mean similarity split */
export const LIFESTYLE_DIMENSION_WEIGHT = 0.40
export const LIFESTYLE_SUBSCALE_WEIGHT = 0.60

// ═══════════════════════════════════════════
// How You Love Scoring
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

/** Maps forced-choice question IDs to the two how-you-love in each pair */
export const RECEIVING_LANGUAGE_PAIRS: Record<string, [LoveLanguage, LoveLanguage]> = {
  m4_ll_01: ['quality_time', 'acts_of_service'],
  m4_ll_02: ['words_of_affirmation', 'words_of_affirmation'],
  m4_ll_03: ['physical_touch', 'acts_of_service'],
}

export const GIVING_LANGUAGE_PAIRS: Record<string, [LoveLanguage, LoveLanguage]> = {
  m4_ll_04: ['quality_time', 'receiving_gifts'],
  m4_ll_05: ['quality_time', 'physical_touch'],
  m4_ll_06: ['words_of_affirmation', 'acts_of_service'],
}

// ═══════════════════════════════════════════
// Likert Scale Constants
// ═══════════════════════════════════════════

/** Maximum value on the Likert/scenario scale */
export const LIKERT_MAX = 5

/** Minimum value on the Likert/scenario scale */
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
  // Values & Priorities
  life_direction: ['m1_vp_01', 'm1_vp_02', 'm1_vp_03'],
  moral_flexibility: ['m1_vp_04', 'm1_vp_05', 'm1_vp_06'],
  relationship_priority: ['m1_vp_07', 'm1_vp_08'],
  // Attachment Style
  anxiety: ['m2_as_01', 'm2_as_02', 'm2_as_03'],
  avoidance: ['m2_as_04', 'm2_as_05', 'm2_as_06'],
  security: ['m2_as_07', 'm2_as_08'],
  // Communication & Conflict
  conflict_style: ['m3_cc_01', 'm3_cc_02', 'm3_cc_03'],
  repair_capacity: ['m3_cc_04', 'm3_cc_05', 'm3_cc_06'],
  emotional_expression: ['m3_cc_07', 'm3_cc_08'],
  // How You Love
  receiving_language: ['m4_ll_01', 'm4_ll_02', 'm4_ll_03'],
  giving_language: ['m4_ll_04', 'm4_ll_05', 'm4_ll_06'],
  // Hot Takes & Dealbreakers
  boundaries: ['m5_ht_01', 'm5_ht_02', 'm5_ht_03'],
  gender_dynamics: ['m5_ht_04', 'm5_ht_05'],
  vulnerability: ['m5_ht_06', 'm5_ht_07', 'm5_ht_08'],
  // Emotional Intelligence (PAID)
  self_awareness: ['m6_ei_01', 'm6_ei_02', 'm6_ei_03'],
  empathy: ['m6_ei_04', 'm6_ei_05', 'm6_ei_06'],
  emotional_regulation: ['m6_ei_07', 'm6_ei_08', 'm6_ei_09', 'm6_ei_10'],
  // Lifestyle & Ambition (PAID)
  pace_of_life: ['m7_la_01', 'm7_la_02', 'm7_la_03'],
  social_energy: ['m7_la_04', 'm7_la_05', 'm7_la_06'],
  future_vision: ['m7_la_07', 'm7_la_08', 'm7_la_09', 'm7_la_10'],
  // Intimacy & Chemistry (PAID)
  physical_chemistry: ['m8_ic_01', 'm8_ic_02', 'm8_ic_03'],
  emotional_intimacy: ['m8_ic_04', 'm8_ic_05', 'm8_ic_06'],
  desire_dynamics: ['m8_ic_07', 'm8_ic_08', 'm8_ic_09', 'm8_ic_10'],
}
