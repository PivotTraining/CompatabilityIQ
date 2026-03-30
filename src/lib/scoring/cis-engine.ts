// @ts-nocheck -- pending schema regen
// CompatibleIQ -- CIS (Compatibility Index Score) Scoring Engine
// Core engine that takes two users' assessment data and produces a 0-100 compatibility score.

import type {
  DimensionId,
  DimensionScore,
  CISResult,
  CISTier,
  DimensionCompatibility,
  CompatibilityBreakdown,
  DimensionInsight,
  BonusCondition,
  AttachmentStyle,
  ConflictApproach,
  LoveLanguage,
  LoveLanguageProfile,
} from './types'

import {
  DIMENSION_CONFIGS,
  CIS_TIER_THRESHOLDS,
  REVERSE_CONSTANT,
  MAX_LIKERT_DIFFERENCE,
  SUB_SCALE_QUESTIONS,
  VALUES_SUB_SCALE_WEIGHTS,
  EI_FLOOR_THRESHOLD,
  EI_FLOOR_PENALTY,
  ATTACHMENT_HIGH_THRESHOLD,
  SECURE_BONUS,
  BOTH_SECURE_BONUS,
  ANXIOUS_AVOIDANT_PENALTY,
  FEARFUL_AVOIDANT_CAP,
  COMMUNICATION_WEIGHTS,
  CONFLICT_PAIRING_SCORES,
  HORSEMAN_PENALTY,
  HORSEMAN_THRESHOLD,
  LIFESTYLE_DIMENSION_WEIGHT,
  LIFESTYLE_SUBSCALE_WEIGHT,
  LOVE_LANG_MATCH_SCORES,
  LOVE_LANG_BASE_WEIGHT,
  LOVE_LANG_FLEX_WEIGHT,
  RECEIVING_LANGUAGE_PAIRS,
  GIVING_LANGUAGE_PAIRS,
} from './constants'

// ═══════════════════════════════════════════
// Utility Helpers
// ═══════════════════════════════════════════

/** Clamp a value to a range */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** Reverse a Likert score: reversed = 6 - raw */
function reverseScore(raw: number): number {
  return REVERSE_CONSTANT - raw
}

/** Get the numeric answer for a question, applying reverse scoring if needed */
function getAnswer(
  questionId: string,
  answers: Record<string, number | string>,
  reverseItems: string[]
): number {
  const raw = Number(answers[questionId])
  if (isNaN(raw)) return 3 // Default to midpoint if missing
  return reverseItems.includes(questionId) ? reverseScore(raw) : raw
}

/** Compute the mean of an array of numbers */
function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

/** Cosine similarity between two vectors (returns 0-1) */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  if (denominator === 0) return 0
  // Cosine similarity can be negative; clamp to 0-1 for our purposes
  return clamp(dotProduct / denominator, 0, 1)
}

// ═══════════════════════════════════════════
// Individual Dimension Score Computation
// ═══════════════════════════════════════════

/**
 * Compute a user's dimension scores from their raw assessment answers.
 * Handles all 6 dimension types including forced-choice how-you-love.
 */
export function computeDimensionScores(
  dimensionId: DimensionId,
  answers: Record<string, number | string>
): DimensionScore {
  const config = DIMENSION_CONFIGS[dimensionId]
  const subScaleScores: Record<string, number> = {}

  switch (dimensionId) {
    case 'values':
      return computeValuesScores(answers, config.reverseItems)
    case 'attachment':
      return computeAttachmentScores(answers, config.reverseItems)
    case 'communication':
      return computeCommunicationScores(answers, config.reverseItems)
    case 'emotional_intelligence':
      return computeEIScores(answers, config.reverseItems)
    case 'lifestyle_ambition':
      return computeLifestyleScores(answers, config.reverseItems)
    case 'how_you_love':
      return computeLoveLanguageScores(answers, config.reverseItems)
    default: {
      // Generic Likert mean computation for unknown dimensions
      for (const subScale of config.subScales) {
        const questionIds = SUB_SCALE_QUESTIONS[subScale] || []
        const scores = questionIds.map((qId) => getAnswer(qId, answers, config.reverseItems))
        subScaleScores[subScale] = mean(scores)
      }
      return {
        dimensionId,
        dimensionName: config.name,
        overallScore: mean(Object.values(subScaleScores)),
        subScaleScores,
      }
    }
  }
}

// ── Values & Priorities ──

function computeValuesScores(
  answers: Record<string, number | string>,
  reverseItems: string[]
): DimensionScore {
  const subScaleScores: Record<string, number> = {}

  // Life Direction: store as profile vector (raw scores, no mean -- used for cosine similarity)
  const ldQuestions = SUB_SCALE_QUESTIONS.life_direction
  const profileVector = ldQuestions.map((qId) => getAnswer(qId, answers, reverseItems))
  // Also compute a mean for the sub-scale score display
  subScaleScores.life_direction = mean(profileVector)

  // Moral & Ethical: mean score
  const meQuestions = SUB_SCALE_QUESTIONS.moral_ethical
  subScaleScores.moral_ethical = mean(meQuestions.map((qId) => getAnswer(qId, answers, reverseItems)))

  // Relationship Priority: mean score with reversals
  const rpQuestions = SUB_SCALE_QUESTIONS.relationship_priority
  subScaleScores.relationship_priority = mean(rpQuestions.map((qId) => getAnswer(qId, answers, reverseItems)))

  return {
    dimensionId: 'values',
    dimensionName: 'Values & Priorities',
    overallScore: mean(Object.values(subScaleScores)),
    subScaleScores,
    profileVector,
  }
}

// ── Attachment Style ──

function classifyAttachment(
  anxiety: number,
  avoidance: number,
  security: number
): AttachmentStyle {
  const highAnx = anxiety >= ATTACHMENT_HIGH_THRESHOLD
  const highAvd = avoidance >= ATTACHMENT_HIGH_THRESHOLD
  const highSec = security >= ATTACHMENT_HIGH_THRESHOLD

  // Earned secure: high security despite moderate-to-high anxiety or avoidance
  if (highSec && (anxiety >= 3.0 || avoidance >= 3.0)) return 'earned_secure'
  if (highSec && !highAnx && !highAvd) return 'secure'
  if (highAnx && highAvd) return 'fearful_avoidant'
  if (highAnx) return 'anxious_preoccupied'
  if (highAvd) return 'dismissive_avoidant'
  return 'secure' // Default to secure if no pattern is elevated
}

function computeAttachmentScores(
  answers: Record<string, number | string>,
  reverseItems: string[]
): DimensionScore {
  const subScaleScores: Record<string, number> = {}

  subScaleScores.anxiety = mean(
    SUB_SCALE_QUESTIONS.anxiety.map((qId) => getAnswer(qId, answers, reverseItems))
  )
  subScaleScores.avoidance = mean(
    SUB_SCALE_QUESTIONS.avoidance.map((qId) => getAnswer(qId, answers, reverseItems))
  )
  subScaleScores.security = mean(
    SUB_SCALE_QUESTIONS.security.map((qId) => getAnswer(qId, answers, reverseItems))
  )

  const attachmentStyle = classifyAttachment(
    subScaleScores.anxiety,
    subScaleScores.avoidance,
    subScaleScores.security
  )

  return {
    dimensionId: 'attachment',
    dimensionName: 'Attachment Style',
    overallScore: subScaleScores.security, // Security score represents overall attachment health
    subScaleScores,
    attachmentStyle,
  }
}

// ── Communication & Conflict ──

function classifyConflictApproach(
  answers: Record<string, number | string>,
  reverseItems: string[]
): ConflictApproach {
  const com01 = getAnswer('com_01', answers, reverseItems)
  const com02 = getAnswer('com_02', answers, reverseItems)
  // com_03 is reverse-scored, so getAnswer returns the reversed value (high = confrontational)
  // We need the RAW value for collaborator classification
  const com03Raw = Number(answers['com_03']) || 3
  const com04 = getAnswer('com_04', answers, reverseItems)
  const com05 = getAnswer('com_05', answers, reverseItems)

  // Confronter: high on com_01, com_04, com_05
  const confronterMean = mean([com01, com04, com05])
  if (confronterMean >= 3.5) return 'confronter'

  // Collaborator: high raw com_03 (seeks solutions), low com_05 (no hostility)
  if (com03Raw >= 3.5 && com05 <= 2.5) return 'collaborator'

  // Avoider: high com_02 (waits), low com_04 (won't initiate)
  if (com02 >= 3.5 && com04 <= 2.5) return 'avoider'

  // Accommodator: low com_01 (not defensive), low com_04 (not assertive), moderate+ com_02
  if (com01 <= 2.5 && com04 <= 2.5 && com02 >= 3.0) return 'accommodator'

  return 'unclassified'
}

function computeCommunicationScores(
  answers: Record<string, number | string>,
  reverseItems: string[]
): DimensionScore {
  const subScaleScores: Record<string, number> = {}

  // Conflict approach: compute a mean score for display, but classification matters more for compatibility
  subScaleScores.conflict_approach = mean(
    SUB_SCALE_QUESTIONS.conflict_approach.map((qId) => getAnswer(qId, answers, reverseItems))
  )

  // Repair attempts: mean with reversal
  subScaleScores.repair_attempts = mean(
    SUB_SCALE_QUESTIONS.repair_attempts.map((qId) => getAnswer(qId, answers, reverseItems))
  )

  // Emotional expression: mean with reversal
  subScaleScores.emotional_expression = mean(
    SUB_SCALE_QUESTIONS.emotional_expression.map((qId) => getAnswer(qId, answers, reverseItems))
  )

  // Store com_05 raw score for horseman penalty check
  subScaleScores._com05_raw = Number(answers['com_05']) || 3

  const conflictApproach = classifyConflictApproach(answers, reverseItems)

  return {
    dimensionId: 'communication',
    dimensionName: 'Communication & Conflict',
    overallScore: mean([
      subScaleScores.conflict_approach,
      subScaleScores.repair_attempts,
      subScaleScores.emotional_expression,
    ]),
    subScaleScores,
    conflictApproach,
  }
}

// ── Emotional Intelligence ──

function computeEIScores(
  answers: Record<string, number | string>,
  reverseItems: string[]
): DimensionScore {
  const subScaleScores: Record<string, number> = {}

  subScaleScores.self_awareness = mean(
    SUB_SCALE_QUESTIONS.self_awareness.map((qId) => getAnswer(qId, answers, reverseItems))
  )
  subScaleScores.empathy = mean(
    SUB_SCALE_QUESTIONS.empathy.map((qId) => getAnswer(qId, answers, reverseItems))
  )
  subScaleScores.emotional_regulation = mean(
    SUB_SCALE_QUESTIONS.emotional_regulation.map((qId) => getAnswer(qId, answers, reverseItems))
  )

  const overallScore = mean(Object.values(subScaleScores))

  return {
    dimensionId: 'emotional_intelligence',
    dimensionName: 'Emotional Intelligence',
    overallScore,
    subScaleScores,
  }
}

// ── Lifestyle & Ambition ──

function computeLifestyleScores(
  answers: Record<string, number | string>,
  reverseItems: string[]
): DimensionScore {
  const subScaleScores: Record<string, number> = {}

  subScaleScores.pace_of_life = mean(
    SUB_SCALE_QUESTIONS.pace_of_life.map((qId) => getAnswer(qId, answers, reverseItems))
  )
  subScaleScores.social_energy = mean(
    SUB_SCALE_QUESTIONS.social_energy.map((qId) => getAnswer(qId, answers, reverseItems))
  )
  subScaleScores.future_orientation = mean(
    SUB_SCALE_QUESTIONS.future_orientation.map((qId) => getAnswer(qId, answers, reverseItems))
  )

  return {
    dimensionId: 'lifestyle_ambition',
    dimensionName: 'Lifestyle & Ambition',
    overallScore: mean(Object.values(subScaleScores)),
    subScaleScores,
  }
}

// ── How You Loves ──

function computeLoveLanguageScores(
  answers: Record<string, number | string>,
  reverseItems: string[]
): DimensionScore {
  const ALL_LANGUAGES: LoveLanguage[] = [
    'words_of_affirmation',
    'acts_of_service',
    'receiving_gifts',
    'quality_time',
    'physical_touch',
  ]

  // Initialize tallies
  const receivingTally: Record<LoveLanguage, number> = {
    words_of_affirmation: 0,
    acts_of_service: 0,
    receiving_gifts: 0,
    quality_time: 0,
    physical_touch: 0,
  }
  const givingTally: Record<LoveLanguage, number> = { ...receivingTally }

  // Tally receiving forced-choice answers (ll_01 through ll_05)
  for (const [qId, [langA, langB]] of Object.entries(RECEIVING_LANGUAGE_PAIRS)) {
    const answer = String(answers[qId]).toLowerCase()
    if (answer === 'a') {
      receivingTally[langA]++
    } else if (answer === 'b') {
      receivingTally[langB]++
    }
  }

  // Tally giving forced-choice answers (ll_06 through ll_10)
  for (const [qId, [langA, langB]] of Object.entries(GIVING_LANGUAGE_PAIRS)) {
    const answer = String(answers[qId]).toLowerCase()
    if (answer === 'a') {
      givingTally[langA]++
    } else if (answer === 'b') {
      givingTally[langB]++
    }
  }

  // Determine primary languages (highest tally; handle ties as co-primary)
  const maxReceiving = Math.max(...Object.values(receivingTally))
  const receivingLanguages = ALL_LANGUAGES.filter((l) => receivingTally[l] === maxReceiving)

  const maxGiving = Math.max(...Object.values(givingTally))
  const givingLanguages = ALL_LANGUAGES.filter((l) => givingTally[l] === maxGiving)

  // Compute flexibility score from Likert items (ll_11 through ll_15)
  const flexQuestions = SUB_SCALE_QUESTIONS.language_flexibility
  const flexibilityScore = mean(
    flexQuestions.map((qId) => getAnswer(qId, answers, reverseItems))
  )

  const subScaleScores: Record<string, number> = {
    // Store max tally counts for reference
    receiving_language: maxReceiving,
    giving_language: maxGiving,
    language_flexibility: flexibilityScore,
  }

  return {
    dimensionId: 'how_you_love',
    dimensionName: 'How You Loves',
    overallScore: flexibilityScore, // The meaningful numeric score is flexibility
    subScaleScores,
    loveLangProfile: {
      receivingLanguages,
      givingLanguages,
      receivingTally,
      givingTally,
      flexibilityScore,
    },
  }
}

// ═══════════════════════════════════════════
// Pairwise Compatibility Scoring
// ═══════════════════════════════════════════

/**
 * Compute the Compatibility Index Score (CIS) between two users.
 * Takes each user's pre-computed dimension scores and returns a 0-100 overall score.
 */
export function computeCIS(
  userAScores: DimensionScore[],
  userBScores: DimensionScore[]
): CISResult {
  const dimensionScores: DimensionCompatibility[] = []

  // Build lookup maps for quick access
  const aMap = new Map(userAScores.map((s) => [s.dimensionId, s]))
  const bMap = new Map(userBScores.map((s) => [s.dimensionId, s]))

  // Score each dimension
  for (const [dimId, config] of Object.entries(DIMENSION_CONFIGS)) {
    const a = aMap.get(dimId as DimensionId)
    const b = bMap.get(dimId as DimensionId)

    if (!a || !b) continue // Skip if either user is missing this dimension

    let rawScore: number

    switch (dimId as DimensionId) {
      case 'values':
        rawScore = scoreValues(a, b)
        break
      case 'attachment':
        rawScore = scoreAttachment(a, b)
        break
      case 'communication':
        rawScore = scoreCommunication(a, b)
        break
      case 'emotional_intelligence':
        rawScore = scoreEmotionalIntelligence(a, b)
        break
      case 'lifestyle_ambition':
        rawScore = scoreLifestyle(a, b)
        break
      case 'how_you_love':
        rawScore = scoreLoveLanguages(a, b)
        break
      default:
        rawScore = 0.5
    }

    // Convert 0-1 raw score to 0-100 dimension score
    const score = Math.round(clamp(rawScore * 100, 0, 100))
    const weightedScore = (score * config.weight) / 100

    dimensionScores.push({
      dimensionId: dimId as DimensionId,
      dimensionName: config.name,
      score,
      weight: config.weight,
      weightedScore: Math.round(weightedScore * 100) / 100,
      compatibilityType: config.compatibilityType,
    })
  }

  // Sum weighted scores to get the overall CIS (0-100)
  const overallScore = Math.round(
    dimensionScores.reduce((sum, d) => sum + d.weightedScore, 0)
  )

  return {
    overallScore: clamp(overallScore, 0, 100),
    dimensionScores,
    tier: getTier(overallScore),
  }
}

// ═══════════════════════════════════════════
// Per-Dimension Compatibility Functions
// ═══════════════════════════════════════════

/**
 * VALUES: Similarity scoring
 * - life_direction uses cosine similarity on the profile vector
 * - moral_ethical and relationship_priority use 1 - |diff| / maxDiff
 * - Combined with sub-scale weights: 0.35 / 0.30 / 0.35
 */
function scoreValues(a: DimensionScore, b: DimensionScore): number {
  // Life direction: cosine similarity on the 5-item profile vector
  const ldSimilarity = (a.profileVector && b.profileVector)
    ? cosineSimilarity(a.profileVector, b.profileVector)
    : similarityScore(a.subScaleScores.life_direction, b.subScaleScores.life_direction)

  // Moral & ethical: standard similarity
  const meSimilarity = similarityScore(
    a.subScaleScores.moral_ethical,
    b.subScaleScores.moral_ethical
  )

  // Relationship priority: standard similarity
  const rpSimilarity = similarityScore(
    a.subScaleScores.relationship_priority,
    b.subScaleScores.relationship_priority
  )

  return (
    VALUES_SUB_SCALE_WEIGHTS.life_direction * ldSimilarity +
    VALUES_SUB_SCALE_WEIGHTS.moral_ethical * meSimilarity +
    VALUES_SUB_SCALE_WEIGHTS.relationship_priority * rpSimilarity
  )
}

/**
 * ATTACHMENT: Complementarity with guardrails
 * - Base score from anxiety/avoidance distance
 * - Secure bonus when either/both are secure
 * - Anxious-avoidant trap penalty
 * - Fearful-avoidant cap
 */
function scoreAttachment(a: DimensionScore, b: DimensionScore): number {
  const aAnx = a.subScaleScores.anxiety
  const aAvd = a.subScaleScores.avoidance
  const bAnx = b.subScaleScores.anxiety
  const bAvd = b.subScaleScores.avoidance

  // Base score: normalized distance on anxiety + avoidance axes
  let score = 1.0 - (Math.abs(aAnx - bAnx) + Math.abs(aAvd - bAvd)) / 8.0

  const aStyle = a.attachmentStyle!
  const bStyle = b.attachmentStyle!

  // Both secure: best possible bonus
  const aIsSecure = aStyle === 'secure' || aStyle === 'earned_secure'
  const bIsSecure = bStyle === 'secure' || bStyle === 'earned_secure'

  if (aIsSecure && bIsSecure) {
    score += BOTH_SECURE_BONUS
  } else if (aIsSecure || bIsSecure) {
    score += SECURE_BONUS
  }

  // Anxious-avoidant trap: one high anxiety + other high avoidance
  const anxiousAvoidantTrap =
    (aAnx >= ATTACHMENT_HIGH_THRESHOLD && bAvd >= ATTACHMENT_HIGH_THRESHOLD) ||
    (bAnx >= ATTACHMENT_HIGH_THRESHOLD && aAvd >= ATTACHMENT_HIGH_THRESHOLD)
  if (anxiousAvoidantTrap) {
    score -= ANXIOUS_AVOIDANT_PENALTY
  }

  // Fearful-avoidant cap
  const aIsFearful = aStyle === 'fearful_avoidant'
  const bIsFearful = bStyle === 'fearful_avoidant'
  if (aIsFearful || bIsFearful) {
    score = Math.min(score, FEARFUL_AVOIDANT_CAP)
  }

  return clamp(score, 0, 1)
}

/**
 * COMMUNICATION: Complementarity scoring
 * - Conflict approach: pairing scores from Gottman outcome data
 * - Repair attempts: scored by SIMILARITY (min of both, capacity of the weaker partner)
 * - Emotional expression: scored by SIMILARITY (gap = mind-reading expectation)
 * - Horseman penalty for contempt/hostility
 */
function scoreCommunication(a: DimensionScore, b: DimensionScore): number {
  // Conflict approach pairing score
  const aApproach = a.conflictApproach || 'unclassified'
  const bApproach = b.conflictApproach || 'unclassified'
  const pairingKey = `${aApproach}_${bApproach}`
  const conflictScore = CONFLICT_PAIRING_SCORES[pairingKey] ?? 0.50

  // Repair attempts: min of both (only as strong as the weaker partner)
  const repairScore = Math.min(a.subScaleScores.repair_attempts, b.subScaleScores.repair_attempts) / 5.0

  // Emotional expression: similarity (gap creates problems)
  const expressionScore = similarityScore(
    a.subScaleScores.emotional_expression,
    b.subScaleScores.emotional_expression
  )

  // Weighted combination
  let score =
    COMMUNICATION_WEIGHTS.conflict_approach * conflictScore +
    COMMUNICATION_WEIGHTS.repair_attempts * repairScore +
    COMMUNICATION_WEIGHTS.emotional_expression * expressionScore

  // Horseman penalty: if either partner scored high on com_05 (contempt under stress)
  const aCom05 = a.subScaleScores._com05_raw ?? 3
  const bCom05 = b.subScaleScores._com05_raw ?? 3
  if (aCom05 >= HORSEMAN_THRESHOLD || bCom05 >= HORSEMAN_THRESHOLD) {
    score -= HORSEMAN_PENALTY
  }

  return clamp(score, 0, 1)
}

/**
 * EMOTIONAL INTELLIGENCE: Similarity with floor
 * - Base similarity between the two users' EI scores
 * - Level bonus: rewards high-high pairings, penalizes low-low
 * - Floor penalty: if either user is below 2.5, multiply by 0.6
 */
function scoreEmotionalIntelligence(a: DimensionScore, b: DimensionScore): number {
  const scoreA = a.overallScore
  const scoreB = b.overallScore

  // Raw similarity: 1 - |diff| / 4
  const rawSimilarity = 1 - Math.abs(scoreA - scoreB) / MAX_LIKERT_DIFFERENCE

  // Level bonus: reward high absolute levels
  // avg_score_normalized = (avg(A, B) - 1) / 4, range 0-1
  const avgNormalized = (mean([scoreA, scoreB]) - 1) / MAX_LIKERT_DIFFERENCE
  let pairScore = rawSimilarity * (0.7 + 0.3 * avgNormalized)

  // Floor check: if either user scores below threshold, apply penalty
  if (scoreA < EI_FLOOR_THRESHOLD || scoreB < EI_FLOOR_THRESHOLD) {
    pairScore *= EI_FLOOR_PENALTY
  }

  return clamp(pairScore, 0, 1)
}

/**
 * LIFESTYLE & AMBITION: Similarity scoring
 * - Sub-scale similarities computed independently
 * - Final = 0.4 * dimension_similarity + 0.6 * mean(sub_scale_similarities)
 * - Sub-scale weighting catches hidden mismatches within similar overall scores
 */
function scoreLifestyle(a: DimensionScore, b: DimensionScore): number {
  // Overall dimension similarity
  const dimensionSimilarity = similarityScore(a.overallScore, b.overallScore)

  // Per-sub-scale similarities
  const subScaleSimilarities = ['pace_of_life', 'social_energy', 'future_orientation'].map(
    (ss) => similarityScore(a.subScaleScores[ss], b.subScaleScores[ss])
  )
  const meanSubScaleSimilarity = mean(subScaleSimilarities)

  return (
    LIFESTYLE_DIMENSION_WEIGHT * dimensionSimilarity +
    LIFESTYLE_SUBSCALE_WEIGHT * meanSubScaleSimilarity
  )
}

/**
 * HOW YOU LOVE: Complementarity (give-receive cross-matching)
 * - Check if A's giving language matches B's receiving language, and vice versa
 * - Flexibility modifier rescues mismatches
 * - Final = base_match * (0.6 + 0.4 * flexibility_mod)
 */
function scoreLoveLanguages(a: DimensionScore, b: DimensionScore): number {
  const aProfile = a.loveLangProfile
  const bProfile = b.loveLangProfile

  if (!aProfile || !bProfile) {
    // Fallback: use flexibility similarity if profiles are missing
    return similarityScore(a.overallScore, b.overallScore)
  }

  // Check cross-match: A's giving vs. B's receiving, and B's giving vs. A's receiving
  const aGivesMatchesBNeeds = hasLanguageOverlap(
    aProfile.givingLanguages,
    bProfile.receivingLanguages
  )
  const bGivesMatchesANeeds = hasLanguageOverlap(
    bProfile.givingLanguages,
    aProfile.receivingLanguages
  )

  // Determine base match score
  let baseMatch: number
  if (aGivesMatchesBNeeds && bGivesMatchesANeeds) {
    baseMatch = LOVE_LANG_MATCH_SCORES.fullMatch
  } else if (aGivesMatchesBNeeds || bGivesMatchesANeeds) {
    baseMatch = LOVE_LANG_MATCH_SCORES.oneDirectionMatch
  } else {
    // Check for partial credit with co-primary languages via tally overlap
    const partialA = tallyOverlapScore(aProfile.givingTally, bProfile.receivingTally)
    const partialB = tallyOverlapScore(bProfile.givingTally, aProfile.receivingTally)
    const partialCredit = mean([partialA, partialB])
    baseMatch = Math.max(LOVE_LANG_MATCH_SCORES.noMatch, partialCredit)
  }

  // Flexibility modifier: normalize both users' flexibility (1-5) to 0-1, then average
  const flexA = (aProfile.flexibilityScore - 1) / MAX_LIKERT_DIFFERENCE
  const flexB = (bProfile.flexibilityScore - 1) / MAX_LIKERT_DIFFERENCE
  const flexibilityMod = mean([flexA, flexB])

  // Final score with flexibility rescue
  const score = baseMatch * (LOVE_LANG_BASE_WEIGHT + LOVE_LANG_FLEX_WEIGHT * flexibilityMod)

  return clamp(score, 0, 1)
}

/** Check if any language in list A appears in list B */
function hasLanguageOverlap(a: LoveLanguage[], b: LoveLanguage[]): boolean {
  return a.some((lang) => b.includes(lang))
}

/**
 * Compute partial overlap score between two language tallies.
 * Normalized dot product of the tally vectors -- rewards when both users
 * have the same language ranked highly, even if not the #1.
 */
function tallyOverlapScore(
  givingTally: Record<LoveLanguage, number>,
  receivingTally: Record<LoveLanguage, number>
): number {
  const languages: LoveLanguage[] = [
    'words_of_affirmation',
    'acts_of_service',
    'receiving_gifts',
    'quality_time',
    'physical_touch',
  ]
  const giveVec = languages.map((l) => givingTally[l] || 0)
  const receiveVec = languages.map((l) => receivingTally[l] || 0)

  // Normalize to 0-1 range using max possible (each language appears in 2 of 5 questions)
  const maxCount = 2
  const giveNorm = giveVec.map((v) => v / maxCount)
  const receiveNorm = receiveVec.map((v) => v / maxCount)

  return cosineSimilarity(giveNorm, receiveNorm)
}

// ═══════════════════════════════════════════
// Shared Scoring Helpers
// ═══════════════════════════════════════════

/**
 * Standard similarity score for two values on a 1-5 Likert scale.
 * Returns 0-1 where 1 = identical scores.
 */
function similarityScore(a: number, b: number): number {
  return 1 - Math.abs(a - b) / MAX_LIKERT_DIFFERENCE
}

/** Determine the CIS tier from an overall score */
function getTier(score: number): CISTier {
  if (score >= CIS_TIER_THRESHOLDS.rare.min) return 'rare'
  if (score >= CIS_TIER_THRESHOLDS.synergistic.min) return 'synergistic'
  if (score >= CIS_TIER_THRESHOLDS.compatible.min) return 'compatible'
  return 'misaligned'
}

// ═══════════════════════════════════════════
// Resonance Report: Compatibility Breakdown
// ═══════════════════════════════════════════

/**
 * Generate a detailed compatibility breakdown for the Resonance Report.
 * Includes per-dimension narratives, strengths, growth areas, and bonus conditions.
 */
export function generateCompatibilityBreakdown(
  userAScores: DimensionScore[],
  userBScores: DimensionScore[]
): CompatibilityBreakdown {
  const cisResult = computeCIS(userAScores, userBScores)
  const aMap = new Map(userAScores.map((s) => [s.dimensionId, s]))
  const bMap = new Map(userBScores.map((s) => [s.dimensionId, s]))

  const dimensions: DimensionInsight[] = cisResult.dimensionScores.map((dim) => {
    const a = aMap.get(dim.dimensionId)
    const b = bMap.get(dim.dimensionId)
    const { narrative, highlights } = generateDimensionNarrative(dim, a, b)

    return {
      ...dim,
      narrative,
      highlights,
    }
  })

  // Identify strengths (dimensions scoring >= 75) and growth areas (dimensions scoring < 60)
  const strengths = dimensions
    .filter((d) => d.score >= 75)
    .map((d) => `${d.dimensionName}: ${getStrengthLabel(d.score)}`)

  const growthAreas = dimensions
    .filter((d) => d.score < 60)
    .map((d) => `${d.dimensionName}: ${getGrowthLabel(d)}`)

  // Check for bonus conditions
  const bonuses = detectBonuses(userAScores, userBScores, cisResult)

  return {
    overallScore: cisResult.overallScore,
    tier: cisResult.tier,
    dimensions,
    strengths,
    growthAreas,
    bonuses,
  }
}

// ═══════════════════════════════════════════
// Narrative Generation Helpers
// ═══════════════════════════════════════════

function generateDimensionNarrative(
  dim: DimensionCompatibility,
  a?: DimensionScore,
  b?: DimensionScore
): { narrative: string; highlights: string[] } {
  const highlights: string[] = []
  let narrative = ''

  switch (dim.dimensionId) {
    case 'values': {
      if (dim.score >= 80) {
        narrative = 'You share a remarkably aligned set of core values and life priorities. This is the foundation that long-term relationships are built on.'
      } else if (dim.score >= 60) {
        narrative = 'Your values are broadly compatible with some areas of natural difference. These differences can enrich your perspective if navigated with curiosity.'
      } else {
        narrative = 'There are meaningful differences in your core values and life direction. This dimension benefits most from open, early conversations about priorities.'
      }
      if (a && b) {
        const rpDiff = Math.abs(
          (a.subScaleScores.relationship_priority || 3) -
          (b.subScaleScores.relationship_priority || 3)
        )
        if (rpDiff > 1.5) {
          highlights.push('Notable difference in how central the relationship is to each of your lives.')
        }
      }
      break
    }

    case 'attachment': {
      if (a?.attachmentStyle && b?.attachmentStyle) {
        const aSecure = a.attachmentStyle === 'secure' || a.attachmentStyle === 'earned_secure'
        const bSecure = b.attachmentStyle === 'secure' || b.attachmentStyle === 'earned_secure'

        if (aSecure && bSecure) {
          narrative = 'Both of you bring secure attachment patterns to the relationship. This creates a stable emotional foundation where both partners feel safe to be themselves.'
          highlights.push('Both partners are securely attached -- the strongest possible foundation.')
        } else if (aSecure || bSecure) {
          narrative = 'One of you brings a secure attachment style that can serve as a stabilizing anchor. Secure partners naturally help regulate their partner\'s attachment anxiety or avoidance over time.'
          highlights.push('A securely attached partner provides a regulatory anchor for the relationship.')
        } else {
          narrative = 'Your attachment patterns may create some predictable friction points. Understanding each other\'s attachment needs can transform potential conflict into deeper connection.'
        }

        if (
          (a.attachmentStyle === 'anxious_preoccupied' && b.attachmentStyle === 'dismissive_avoidant') ||
          (b.attachmentStyle === 'anxious_preoccupied' && a.attachmentStyle === 'dismissive_avoidant')
        ) {
          highlights.push('Caution: anxious-avoidant dynamic detected. This pairing can create a pursue-withdraw cycle that requires intentional work to break.')
        }
      }
      break
    }

    case 'communication': {
      if (dim.score >= 75) {
        narrative = 'Your communication styles complement each other well. You have the ingredients for healthy conflict resolution and emotional transparency.'
      } else if (dim.score >= 60) {
        narrative = 'Your communication styles are workable but may require intentional adjustment during high-stress moments. Focus on repair -- your ability to come back together after conflict.'
      } else {
        narrative = 'Communication and conflict style is the most trainable dimension. The current mismatch is a growth opportunity, not a dealbreaker.'
      }
      if (a && b) {
        const repairMin = Math.min(
          a.subScaleScores.repair_attempts || 3,
          b.subScaleScores.repair_attempts || 3
        )
        if (repairMin >= 3.5) {
          highlights.push('Strong repair capacity in both partners -- the #1 predictor of relationship longevity.')
        } else if (repairMin < 2.5) {
          highlights.push('Repair attempts could use strengthening. This is the single most important skill to develop together.')
        }
      }
      break
    }

    case 'emotional_intelligence': {
      if (dim.score >= 75) {
        narrative = 'You both bring strong emotional intelligence to the relationship. This predicts better conflict resolution, deeper attunement, and higher satisfaction.'
      } else if (dim.score >= 60) {
        narrative = 'Your emotional intelligence levels are reasonably aligned. Small investments in self-awareness and empathy will compound over time.'
      } else {
        narrative = 'There is room for growth in emotional intelligence for this pairing. EQ is highly trainable -- individual development here will benefit every relationship in your life.'
      }
      if (a && b) {
        if (a.overallScore < EI_FLOOR_THRESHOLD || b.overallScore < EI_FLOOR_THRESHOLD) {
          highlights.push('One or both partners scored below the EI floor threshold. Individual emotional intelligence development is recommended before focusing on the pairing.')
        }
      }
      break
    }

    case 'lifestyle_ambition': {
      if (dim.score >= 75) {
        narrative = 'You want similar things from daily life -- pace, social energy, and future direction are well aligned. This compatibility prevents the slow erosion that lifestyle mismatches cause.'
      } else if (dim.score >= 60) {
        narrative = 'Your lifestyles are broadly compatible with some areas of natural difference. Being intentional about how you spend weekends and vacations will help.'
      } else {
        narrative = 'Your ideal lifestyles look fairly different. This doesn\'t mean incompatibility, but it does mean you\'ll need to negotiate how you spend time and energy.'
      }
      break
    }

    case 'how_you_love': {
      if (dim.score >= 75) {
        narrative = 'What you naturally give is what your partner needs to receive, and vice versa. This creates an effortless give-receive loop that keeps both partners feeling loved.'
      } else if (dim.score >= 60) {
        narrative = 'Your how-you-love don\'t perfectly align, but flexibility scores suggest you can adapt. The key is learning your partner\'s primary receiving language and practicing it.'
      } else {
        narrative = 'Your how-you-love are mismatched, and flexibility is limited. This means intentional effort will be required to make your partner feel loved in the way they need.'
      }
      if (a?.loveLangProfile && b?.loveLangProfile) {
        const aGives = a.loveLangProfile.givingLanguages
        const bNeeds = b.loveLangProfile.receivingLanguages
        if (hasLanguageOverlap(aGives, bNeeds)) {
          highlights.push(`Natural alignment: one partner naturally gives what the other most needs to receive.`)
        }
      }
      break
    }
  }

  return { narrative, highlights }
}

function getStrengthLabel(score: number): string {
  if (score >= 90) return 'Exceptional alignment'
  if (score >= 80) return 'Strong natural compatibility'
  return 'Solid foundation'
}

function getGrowthLabel(dim: DimensionInsight): string {
  if (dim.score < 40) return 'Significant difference -- requires intentional work'
  return 'Area for growth and mutual understanding'
}

function detectBonuses(
  aScores: DimensionScore[],
  bScores: DimensionScore[],
  cisResult: CISResult
): BonusCondition[] {
  const bonuses: BonusCondition[] = []
  const aMap = new Map(aScores.map((s) => [s.dimensionId, s]))
  const bMap = new Map(bScores.map((s) => [s.dimensionId, s]))

  // Both secure attachment
  const aAttach = aMap.get('attachment')
  const bAttach = bMap.get('attachment')
  if (aAttach && bAttach) {
    const aSecure = aAttach.attachmentStyle === 'secure' || aAttach.attachmentStyle === 'earned_secure'
    const bSecure = bAttach.attachmentStyle === 'secure' || bAttach.attachmentStyle === 'earned_secure'
    if (aSecure && bSecure) {
      bonuses.push({
        id: 'bothSecureAttachment',
        label: 'Both Secure Attachment',
        points: 5,
      })
    }
  }

  // High values alignment
  const valuesDim = cisResult.dimensionScores.find((d) => d.dimensionId === 'values')
  if (valuesDim && valuesDim.score >= 90) {
    bonuses.push({
      id: 'valuesAlignmentHigh',
      label: 'Values Alignment >= 90',
      points: 4,
    })
  }

  return bonuses
}
