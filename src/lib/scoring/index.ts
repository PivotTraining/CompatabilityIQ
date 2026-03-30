// @ts-nocheck -- pending schema regen
// CompatibleIQ -- CIS Scoring Engine
// Public API exports

export { computeDimensionScores, computeCIS, generateCompatibilityBreakdown } from './cis-engine'
export { findResonances } from './match-engine'
export { DIMENSION_CONFIGS, CIS_TIER_THRESHOLDS, MATCH_THRESHOLD } from './constants'
export type {
  DimensionId,
  DimensionScore,
  CISResult,
  CISTier,
  DimensionCompatibility,
  CompatibilityBreakdown,
  MatchCandidate,
  AttachmentStyle,
  ConflictApproach,
  LoveLanguage,
  LoveLanguageProfile,
} from './types'
