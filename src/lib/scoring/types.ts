// CompatibleIQ -- CIS Scoring Engine Types
// All types for the Compatibility Index Score system

// ═══════════════════════════════════════════
// Dimension & Sub-Scale Types
// ═══════════════════════════════════════════

/** The 6 assessment dimensions */
export type DimensionId =
  | 'values'
  | 'attachment'
  | 'communication'
  | 'emotional_intelligence'
  | 'lifestyle_ambition'
  | 'love_languages'

/** How a dimension's compatibility is scored */
export type CompatibilityType =
  | 'similarity'
  | 'complementarity'
  | 'complementary_with_guardrails'
  | 'similarity_with_floor'

/** A user's computed scores for a single dimension */
export interface DimensionScore {
  dimensionId: DimensionId
  dimensionName: string
  /** Overall mean score for the dimension (1.0-5.0 for Likert scales) */
  overallScore: number
  /** Scores for each sub-scale within the dimension */
  subScaleScores: Record<string, number>
  /** For values dimension: the raw profile vector for life_direction */
  profileVector?: number[]
  /** For attachment dimension: the classified attachment style */
  attachmentStyle?: AttachmentStyle
  /** For communication dimension: the classified conflict approach */
  conflictApproach?: ConflictApproach
  /** For love languages dimension: primary giving and receiving languages */
  loveLangProfile?: LoveLanguageProfile
}

// ═══════════════════════════════════════════
// Attachment Types
// ═══════════════════════════════════════════

export type AttachmentStyle =
  | 'secure'
  | 'anxious_preoccupied'
  | 'dismissive_avoidant'
  | 'fearful_avoidant'
  | 'earned_secure'

// ═══════════════════════════════════════════
// Communication Types
// ═══════════════════════════════════════════

export type ConflictApproach =
  | 'confronter'
  | 'avoider'
  | 'collaborator'
  | 'accommodator'
  | 'unclassified'

/** Pairing scores for conflict approach combinations (from Gottman outcome data) */
export type ConflictPairingKey = `${ConflictApproach}_${ConflictApproach}`

// ═══════════════════════════════════════════
// Love Language Types
// ═══════════════════════════════════════════

export type LoveLanguage =
  | 'words_of_affirmation'
  | 'acts_of_service'
  | 'receiving_gifts'
  | 'quality_time'
  | 'physical_touch'

export interface LoveLanguageProfile {
  /** Primary language(s) for receiving love (can be co-primary if tied) */
  receivingLanguages: LoveLanguage[]
  /** Primary language(s) for giving love (can be co-primary if tied) */
  givingLanguages: LoveLanguage[]
  /** Tally of how many times each language was selected for receiving */
  receivingTally: Record<LoveLanguage, number>
  /** Tally of how many times each language was selected for giving */
  givingTally: Record<LoveLanguage, number>
  /** Flexibility score from the Likert sub-scale (1.0-5.0) */
  flexibilityScore: number
}

// ═══════════════════════════════════════════
// CIS Result Types
// ═══════════════════════════════════════════

/** The overall CIS compatibility result between two users */
export interface CISResult {
  /** Overall compatibility score from 0-100 */
  overallScore: number
  /** Per-dimension compatibility breakdown */
  dimensionScores: DimensionCompatibility[]
  /** Compatibility tier based on overall score */
  tier: CISTier
}

/** Compatibility score for a single dimension */
export interface DimensionCompatibility {
  dimensionId: DimensionId
  dimensionName: string
  /** Raw compatibility score for this dimension (0-100) */
  score: number
  /** Weight of this dimension in the overall CIS (out of 100) */
  weight: number
  /** Weighted contribution to the overall CIS */
  weightedScore: number
  /** The scoring method used for this dimension */
  compatibilityType: CompatibilityType
}

/** Compatibility tier thresholds */
export type CISTier = 'rare' | 'synergistic' | 'compatible' | 'misaligned'

// ═══════════════════════════════════════════
// Resonance Report Types
// ═══════════════════════════════════════════

/** Detailed compatibility breakdown for the Resonance Report */
export interface CompatibilityBreakdown {
  overallScore: number
  tier: CISTier
  dimensions: DimensionInsight[]
  strengths: string[]
  growthAreas: string[]
  bonuses: BonusCondition[]
}

/** Per-dimension insight for the Resonance Report */
export interface DimensionInsight {
  dimensionId: DimensionId
  dimensionName: string
  score: number
  weight: number
  weightedScore: number
  compatibilityType: CompatibilityType
  /** Human-readable summary of this dimension's compatibility */
  narrative: string
  /** Specific observations for this dimension */
  highlights: string[]
}

/** Bonus conditions that were triggered */
export interface BonusCondition {
  id: string
  label: string
  points: number
}

// ═══════════════════════════════════════════
// Match Engine Types
// ═══════════════════════════════════════════

/** A potential match candidate returned by the match engine */
export interface MatchCandidate {
  userId: string
  firstName: string
  bio: string
  photoUrls: string[]
  locationCity: string | null
  locationState: string | null
  genderIdentity: string | null
  dateOfBirth: string | null
  cisResult: CISResult
}
