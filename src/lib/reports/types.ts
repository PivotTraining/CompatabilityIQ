// CompatibleIQ -- Resonance Report Types
// Types for the premium $4.99 compatibility breakdown report

import type { CISTier, DimensionId, AttachmentStyle, ConflictApproach, LoveLanguage } from '../scoring/types'

// ═══════════════════════════════════════════
// Report Types
// ═══════════════════════════════════════════

/** The complete Resonance Report -- the premium product */
export interface ResonanceReport {
  id: string
  matchId: string
  purchasedByUserId: string
  overallScore: number
  tier: CISTier
  tierLabel: string
  summary: string
  dimensions: DimensionReport[]
  strengths: StrengthNarrative[]
  frictionPoints: FrictionNarrative[]
  conversationStarters: string[]
  trajectory: TrajectoryPrediction
  generatedAt: string
}

/** Per-dimension breakdown in the report */
export interface DimensionReport {
  dimensionId: DimensionId
  dimensionName: string
  score: number
  weight: number
  indicator: MatchIndicator
  userAProfile: string
  userBProfile: string
  compatibilityNarrative: string
}

/** Visual match quality indicator */
export type MatchIndicator = 'Strong Match' | 'Good Match' | 'Growth Area' | 'Watch Out'

/** Top-3 strengths as a pair */
export interface StrengthNarrative {
  dimensionId: DimensionId
  dimensionName: string
  score: number
  narrative: string
}

/** Top-2 friction points */
export interface FrictionNarrative {
  dimensionId: DimensionId
  dimensionName: string
  score: number
  narrative: string
}

/** 3-phase trajectory prediction */
export interface TrajectoryPrediction {
  earlyPhase: string
  buildingPhase: string
  longTerm: string
}

// ═══════════════════════════════════════════
// Template Types
// ═══════════════════════════════════════════

/** Score range bucket for template selection */
export type ScoreRange = 'high' | 'medium' | 'low'

/** Narrative templates keyed by score range with multiple variants */
export interface ScoreRangeNarratives {
  high: string[]   // score 80-100
  medium: string[] // score 60-79
  low: string[]    // score 0-59
}

/** Template context variables injected into narrative strings */
export interface TemplateContext {
  userAName: string
  userBName: string
  score: number
  tier: CISTier
  dimensionName: string
  /** Top scoring sub-scale name */
  topSubScale: string
  /** Lowest scoring sub-scale name */
  gapSubScale: string
  /** User A's attachment style (if applicable) */
  userAAttachment?: AttachmentStyle
  /** User B's attachment style (if applicable) */
  userBAttachment?: AttachmentStyle
  /** User A's conflict approach (if applicable) */
  userAConflict?: ConflictApproach
  /** User B's conflict approach (if applicable) */
  userBConflict?: ConflictApproach
  /** User A's primary receiving love style */
  userAReceiving?: LoveLanguage
  /** User B's primary receiving love style */
  userBReceiving?: LoveLanguage
  /** User A's primary giving love style */
  userAGiving?: LoveLanguage
  /** User B's primary giving love style */
  userBGiving?: LoveLanguage
  /** User A's dimension overall score (1-5 scale) */
  userAScore: number
  /** User B's dimension overall score (1-5 scale) */
  userBScore: number
  /** Sub-scale scores for User A */
  userASubScales: Record<string, number>
  /** Sub-scale scores for User B */
  userBSubScales: Record<string, number>
}

/** User profile data needed for report generation */
export interface ReportUserProfile {
  userId: string
  firstName: string
  dimensionScores: import('../scoring/types').DimensionScore[]
}

/** Match data needed for report generation */
export interface ReportMatchData {
  matchId: string
  userA: ReportUserProfile
  userB: ReportUserProfile
  cisResult: import('../scoring/types').CISResult
}
