// CompatibleIQ -- Resonance Report Generator
// Premium $4.99 product: detailed compatibility breakdown between two matched users
// All narratives are template-driven -- no AI API calls

import { createClient } from '@supabase/supabase-js'
import { DIMENSION_CONFIGS, CIS_TIER_THRESHOLDS } from '../scoring/constants'
import type {
  DimensionId,
  DimensionScore,
  CISResult,
  CISTier,
  DimensionCompatibility,
  AttachmentStyle,
  ConflictApproach,
  LoveLanguage,
} from '../scoring/types'
import type {
  ResonanceReport,
  DimensionReport,
  StrengthNarrative,
  FrictionNarrative,
  TrajectoryPrediction,
  MatchIndicator,
  ScoreRange,
  TemplateContext,
  ReportMatchData,
  ReportUserProfile,
} from './types'
import {
  DIMENSION_NARRATIVES,
  USER_PROFILE_TEMPLATES,
  STRENGTH_NARRATIVES,
  FRICTION_NARRATIVES,
  CONVERSATION_STARTERS,
  TRAJECTORY_TEMPLATES,
  OVERALL_SUMMARY_TEMPLATES,
  SCORE_LABELS,
} from './templates'

// ═══════════════════════════════════════════
// Main Entry Point
// ═══════════════════════════════════════════

/**
 * Generates a complete Resonance Report for a match.
 * Fetches match data from Supabase, computes narratives from templates,
 * and returns a fully populated ResonanceReport.
 */
export async function generateResonanceReport(
  matchId: string,
  purchasedByUserId: string
): Promise<ResonanceReport> {
  // Fetch match data from database
  const matchData = await fetchMatchData(matchId, purchasedByUserId)

  // Determine who is "User A" (the purchaser) and "User B" (the partner)
  const userA = matchData.userA.userId === purchasedByUserId
    ? matchData.userA
    : matchData.userB
  const userB = matchData.userA.userId === purchasedByUserId
    ? matchData.userB
    : matchData.userA

  const cisResult = matchData.cisResult
  const overallScore = cisResult.overallScore
  const tier = cisResult.tier
  const tierLabel = CIS_TIER_THRESHOLDS[tier].label

  // Sort dimensions by score for strengths/friction identification
  const sortedDimensions = [...cisResult.dimensionScores].sort((a, b) => b.score - a.score)
  const topDimensions = sortedDimensions.slice(0, 3)
  const bottomDimensions = sortedDimensions.slice(-2)

  // Generate all report sections
  const dimensions = generateDimensionReports(cisResult.dimensionScores, userA, userB)
  const strengths = generateStrengths(topDimensions, userA, userB)
  const frictionPoints = generateFrictionPoints(bottomDimensions, userA, userB)
  const conversationStarters = generateConversationStarters(cisResult.dimensionScores, userA, userB)
  const trajectory = generateTrajectory(overallScore)
  const summary = generateOverallSummary(
    overallScore,
    tier,
    userB.firstName,
    sortedDimensions[0].dimensionName,
    sortedDimensions[sortedDimensions.length - 1].dimensionName
  )

  const reportId = `rr_${matchId}_${Date.now()}`

  return {
    id: reportId,
    matchId,
    purchasedByUserId,
    overallScore,
    tier,
    tierLabel,
    summary,
    dimensions,
    strengths,
    frictionPoints,
    conversationStarters,
    trajectory,
    generatedAt: new Date().toISOString(),
  }
}

// ═══════════════════════════════════════════
// Data Fetching
// ═══════════════════════════════════════════

async function fetchMatchData(
  matchId: string,
  purchasedByUserId: string
): Promise<ReportMatchData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch the match record
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single()

  if (matchError || !match) {
    throw new Error(`Match not found: ${matchId}`)
  }

  // Verify the purchaser is part of this match
  if (match.user_a_id !== purchasedByUserId && match.user_b_id !== purchasedByUserId) {
    throw new Error('Unauthorized: user is not part of this match')
  }

  // Fetch both user profiles and assessment scores
  const [userAData, userBData] = await Promise.all([
    fetchUserProfile(supabase, match.user_a_id),
    fetchUserProfile(supabase, match.user_b_id),
  ])

  // Fetch or reconstruct the CIS result
  const cisResult: CISResult = {
    overallScore: match.cis_score,
    tier: determineTier(match.cis_score),
    dimensionScores: match.dimension_scores || [],
  }

  return {
    matchId,
    userA: userAData,
    userB: userBData,
    cisResult,
  }
}

async function fetchUserProfile(
  supabase: ReturnType<typeof createClient<any>>,
  userId: string
): Promise<ReportUserProfile> {
  const [profileResult, scoresResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, first_name')
      .eq('id', userId)
      .single(),
    supabase
      .from('assessment_scores')
      .select('*')
      .eq('user_id', userId),
  ])

  if (profileResult.error || !profileResult.data) {
    throw new Error(`Profile not found for user: ${userId}`)
  }

  // Transform database scores into DimensionScore format
  const dimensionScores = transformDatabaseScores(scoresResult.data || [])

  return {
    userId,
    firstName: profileResult.data.first_name || 'Your match',
    dimensionScores,
  }
}

function transformDatabaseScores(dbScores: any[]): DimensionScore[] {
  const dimensionMap = new Map<string, DimensionScore>()

  for (const row of dbScores) {
    const dimId = row.dimension_id as DimensionId
    if (!dimensionMap.has(dimId)) {
      const config = DIMENSION_CONFIGS[dimId]
      dimensionMap.set(dimId, {
        dimensionId: dimId,
        dimensionName: config?.name || dimId,
        overallScore: row.overall_score || 3.0,
        subScaleScores: row.sub_scale_scores || {},
        profileVector: row.profile_vector || undefined,
        attachmentStyle: row.attachment_style || undefined,
        conflictApproach: row.conflict_approach || undefined,
        loveLangProfile: row.love_lang_profile || undefined,
      })
    }
  }

  return Array.from(dimensionMap.values())
}

// ═══════════════════════════════════════════
// Dimension Reports
// ═══════════════════════════════════════════

function generateDimensionReports(
  dimensionScores: DimensionCompatibility[],
  userA: ReportUserProfile,
  userB: ReportUserProfile
): DimensionReport[] {
  return dimensionScores.map((dimCompat) => {
    const dimId = dimCompat.dimensionId as DimensionId
    const score = dimCompat.score
    const indicator = getMatchIndicator(score)

    const userADim = findDimensionScore(userA.dimensionScores, dimId)
    const userBDim = findDimensionScore(userB.dimensionScores, dimId)

    const context = buildTemplateContext(dimId, score, userA, userB, userADim, userBDim)

    const userAProfile = generateUserProfile(dimId, userA.firstName, userADim)
    const userBProfile = generateUserProfile(dimId, userB.firstName, userBDim)
    const compatibilityNarrative = generateDimensionNarrative(dimId, score, context)

    return {
      dimensionId: dimId,
      dimensionName: dimCompat.dimensionName,
      score,
      weight: dimCompat.weight,
      indicator,
      userAProfile,
      userBProfile,
      compatibilityNarrative,
    }
  })
}

function getMatchIndicator(score: number): MatchIndicator {
  if (score >= 80) return 'Strong Match'
  if (score >= 65) return 'Good Match'
  if (score >= 45) return 'Growth Area'
  return 'Watch Out'
}

function generateDimensionNarrative(
  dimId: DimensionId,
  score: number,
  context: TemplateContext
): string {
  const range = getScoreRange(score)
  const templates = DIMENSION_NARRATIVES[dimId]?.[range] || []
  if (templates.length === 0) return ''

  const template = pickVariant(templates, context.score)
  return interpolate(template, context)
}

function generateUserProfile(
  dimId: DimensionId,
  name: string,
  dimScore?: DimensionScore
): string {
  const templates = USER_PROFILE_TEMPLATES[dimId]
  if (!templates || !dimScore) {
    return `${name} completed the ${DIMENSION_CONFIGS[dimId]?.name || dimId} assessment.`
  }

  const parts: string[] = []

  switch (dimId) {
    case 'values': {
      const subScores = dimScore.subScaleScores
      // Determine primary value orientation
      const lifeDir = subScores.life_direction || 3.0
      const moral = subScores.moral_ethical || 3.0
      const relPriority = subScores.relationship_priority || 3.0

      if (lifeDir >= 3.5 && (subScores.val_01_raw || lifeDir) > 3.5) {
        parts.push(pickAndInterpolate(templates.high_career, { name }))
      } else if (lifeDir >= 3.5) {
        parts.push(pickAndInterpolate(templates.high_family, { name }))
      } else {
        parts.push(pickAndInterpolate(templates.moderate, { name }))
      }
      if (moral >= 4.0) {
        parts.push(pickAndInterpolate(templates.high_moral, { name }))
      }
      if (relPriority >= 3.8) {
        parts.push(pickAndInterpolate(templates.high_relationship_priority, { name }))
      } else if (relPriority <= 2.5) {
        parts.push(pickAndInterpolate(templates.low_relationship_priority, { name }))
      }
      break
    }
    case 'attachment': {
      const style = dimScore.attachmentStyle || 'secure'
      const styleTemplates = templates[style] || templates.secure
      parts.push(pickAndInterpolate(styleTemplates, { name }))
      break
    }
    case 'communication': {
      const approach = dimScore.conflictApproach || 'collaborator'
      const approachTemplates = templates[approach] || templates.collaborator
      parts.push(pickAndInterpolate(approachTemplates, { name }))

      const repair = dimScore.subScaleScores.repair_attempts || 3.0
      if (repair >= 4.0) {
        parts.push(pickAndInterpolate(templates.high_repair, { name }))
      } else if (repair <= 2.5) {
        parts.push(pickAndInterpolate(templates.low_repair, { name }))
      }

      const expression = dimScore.subScaleScores.emotional_expression || 3.0
      if (expression >= 4.0) {
        parts.push(pickAndInterpolate(templates.high_expression, { name }))
      } else if (expression <= 2.5) {
        parts.push(pickAndInterpolate(templates.low_expression, { name }))
      }
      break
    }
    case 'emotional_intelligence': {
      const overall = dimScore.overallScore
      const topSub = getTopSubScale(dimScore.subScaleScores)
      const gapSub = getGapSubScale(dimScore.subScaleScores)
      if (overall >= 4.0) {
        parts.push(pickAndInterpolate(templates.high, { name }))
      } else if (overall >= 3.0) {
        parts.push(pickAndInterpolate(templates.moderate, {
          name,
          topSubScale: formatSubScaleName(topSub),
          gapSubScale: formatSubScaleName(gapSub),
        }))
      } else {
        parts.push(pickAndInterpolate(templates.low, {
          name,
          topSubScale: formatSubScaleName(topSub),
          gapSubScale: formatSubScaleName(gapSub),
        }))
      }
      break
    }
    case 'lifestyle_ambition': {
      const pace = dimScore.subScaleScores.pace_of_life || 3.0
      const social = dimScore.subScaleScores.social_energy || 3.0
      const future = dimScore.subScaleScores.future_orientation || 3.0

      if (pace >= 3.5) {
        parts.push(pickAndInterpolate(templates.high_pace, { name }))
      } else if (pace <= 2.5) {
        parts.push(pickAndInterpolate(templates.low_pace, { name }))
      }
      if (social >= 3.5) {
        parts.push(pickAndInterpolate(templates.high_social, { name }))
      } else if (social <= 2.5) {
        parts.push(pickAndInterpolate(templates.low_social, { name }))
      }
      if (future >= 3.5) {
        parts.push(pickAndInterpolate(templates.high_future, { name }))
      } else if (future <= 2.5) {
        parts.push(pickAndInterpolate(templates.low_future, { name }))
      }
      if (parts.length === 0) {
        parts.push(`${name} shows a balanced lifestyle profile without strong leanings in any direction -- adaptable and open to a partner's rhythm.`)
      }
      break
    }
    case 'how_you_love': {
      const profile = dimScore.loveLangProfile
      if (profile && profile.receivingLanguages.length > 0) {
        const primary = profile.receivingLanguages[0]
        const langTemplates = templates[primary]
        if (langTemplates) {
          parts.push(pickAndInterpolate(langTemplates, { name }))
        }
      } else {
        parts.push(`${name} shows a balanced love style profile, responsive to multiple forms of affection without a dominant preference.`)
      }
      break
    }
  }

  return parts.join(' ')
}

// ═══════════════════════════════════════════
// Strengths
// ═══════════════════════════════════════════

function generateStrengths(
  topDimensions: DimensionCompatibility[],
  userA: ReportUserProfile,
  userB: ReportUserProfile
): StrengthNarrative[] {
  return topDimensions.map((dim) => {
    const dimId = dim.dimensionId as DimensionId
    const templates = STRENGTH_NARRATIVES[dimId] || []
    const narrative = templates.length > 0
      ? pickVariant(templates, dim.score)
      : `Your ${dim.dimensionName} compatibility (${dim.score}/100) is a genuine strength in this relationship.`

    return {
      dimensionId: dimId,
      dimensionName: dim.dimensionName,
      score: dim.score,
      narrative,
    }
  })
}

// ═══════════════════════════════════════════
// Friction Points
// ═══════════════════════════════════════════

function generateFrictionPoints(
  bottomDimensions: DimensionCompatibility[],
  userA: ReportUserProfile,
  userB: ReportUserProfile
): FrictionNarrative[] {
  return bottomDimensions.map((dim) => {
    const dimId = dim.dimensionId as DimensionId
    const templates = FRICTION_NARRATIVES[dimId] || []
    const narrative = templates.length > 0
      ? pickVariant(templates, dim.score)
      : `Your ${dim.dimensionName} compatibility (${dim.score}/100) is an area that will benefit from intentional attention and honest conversation.`

    return {
      dimensionId: dimId,
      dimensionName: dim.dimensionName,
      score: dim.score,
      narrative,
    }
  })
}

// ═══════════════════════════════════════════
// Conversation Starters
// ═══════════════════════════════════════════

function generateConversationStarters(
  dimensionScores: DimensionCompatibility[],
  userA: ReportUserProfile,
  userB: ReportUserProfile
): string[] {
  const starters: string[] = []
  const sorted = [...dimensionScores].sort((a, b) => b.score - a.score)

  // Pick from the 2 strongest and 2 weakest dimensions, plus 1 from middle
  const targetDimensions = [
    sorted[0],                            // top strength
    sorted[sorted.length - 1],            // biggest gap
    sorted[1],                            // second strength
    sorted[sorted.length - 2],            // second gap
    sorted[Math.floor(sorted.length / 2)] // middle
  ]

  for (const dim of targetDimensions) {
    if (starters.length >= 5) break

    const dimId = dim.dimensionId as DimensionId
    const dimStarters = CONVERSATION_STARTERS[dimId] || []
    if (dimStarters.length === 0) continue

    // Pick a starter that hasn't been used yet
    const starterIndex = starters.length % dimStarters.length
    const template = dimStarters[starterIndex]

    const range = getScoreRange(dim.score)
    const scoreLabel = SCORE_LABELS[range] || 'moderately'

    const userADim = findDimensionScore(userA.dimensionScores, dimId)
    const topSub = userADim ? formatSubScaleName(getTopSubScale(userADim.subScaleScores)) : dim.dimensionName

    const filled = template
      .replace(/\{partnerName\}/g, userB.firstName)
      .replace(/\{scoreLabel\}/g, scoreLabel)
      .replace(/\{topSubScale\}/g, topSub)

    starters.push(filled)
  }

  // Pad to 5 if needed with generic but useful starters
  const fallbacks = [
    `Ask ${userB.firstName} what a perfect low-key evening looks like for them. You'll learn more about compatibility in their answer than in a dozen dates.`,
    `Try this with ${userB.firstName}: "What's something you wish more people understood about you?" The answer always reveals something important.`,
    `Ask ${userB.firstName}: "What does feeling supported actually look like for you?" Everyone answers this differently, and the difference matters.`,
    `Over coffee, ask ${userB.firstName}: "What's the best relationship advice you've ever gotten?" Their answer reveals what they value most.`,
    `Ask ${userB.firstName}: "What's one thing you've changed your mind about in the last few years?" Growth mindset is the best predictor of long-term relationship success.`,
  ]

  while (starters.length < 5) {
    starters.push(fallbacks[starters.length])
  }

  return starters.slice(0, 5)
}

// ═══════════════════════════════════════════
// Trajectory
// ═══════════════════════════════════════════

function generateTrajectory(overallScore: number): TrajectoryPrediction {
  const range = getScoreRange(overallScore)

  const earlyTemplates = TRAJECTORY_TEMPLATES.earlyPhase[range] || []
  const buildingTemplates = TRAJECTORY_TEMPLATES.buildingPhase[range] || []
  const longTermTemplates = TRAJECTORY_TEMPLATES.longTerm[range] || []

  return {
    earlyPhase: earlyTemplates.length > 0
      ? pickVariant(earlyTemplates, overallScore)
      : 'Your early months will set the foundation for everything that follows. Focus on building honest communication habits and learning each other\'s rhythms.',
    buildingPhase: buildingTemplates.length > 0
      ? pickVariant(buildingTemplates, overallScore)
      : 'Months 3-12 are where your relationship\'s real character emerges. Use this time to deepen your understanding of each other\'s needs and build shared rituals.',
    longTerm: longTermTemplates.length > 0
      ? pickVariant(longTermTemplates, overallScore)
      : 'Your long-term success will be shaped by the habits you build now. Prioritize ongoing communication and mutual growth, and revisit your compatibility insights as you both evolve.',
  }
}

// ═══════════════════════════════════════════
// Overall Summary
// ═══════════════════════════════════════════

function generateOverallSummary(
  score: number,
  tier: CISTier,
  partnerName: string,
  topDimensionName: string,
  bottomDimensionName: string
): string {
  const templates = OVERALL_SUMMARY_TEMPLATES[tier] || []
  if (templates.length === 0) {
    return `You scored ${score}/100 with ${partnerName}. Your strongest area is ${topDimensionName} and your main growth area is ${bottomDimensionName}.`
  }

  const template = pickVariant(templates, score)
  return template
    .replace(/\{partnerName\}/g, partnerName)
    .replace(/\{score\}/g, String(score))
    .replace(/\{topDimension\}/g, topDimensionName)
    .replace(/\{bottomDimension\}/g, bottomDimensionName)
}

// ═══════════════════════════════════════════
// Template Helpers
// ═══════════════════════════════════════════

function getScoreRange(score: number): ScoreRange {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

/** Deterministically pick a variant based on score to avoid repetition across dimensions */
function pickVariant(templates: string[], seed: number): string {
  const index = Math.abs(Math.round(seed * 7)) % templates.length
  return templates[index]
}

/** Interpolate {variable} placeholders in a template string */
function interpolate(template: string, context: TemplateContext): string {
  return template
    .replace(/\{userAName\}/g, context.userAName)
    .replace(/\{userBName\}/g, context.userBName)
    .replace(/\{score\}/g, String(context.score))
    .replace(/\{dimensionName\}/g, context.dimensionName)
    .replace(/\{topSubScale\}/g, formatSubScaleName(context.topSubScale))
    .replace(/\{gapSubScale\}/g, formatSubScaleName(context.gapSubScale))
    .replace(/\{partnerName\}/g, context.userBName)
    .replace(/\{scoreLabel\}/g, SCORE_LABELS[getScoreRange(context.score)] || 'moderately')
}

function pickAndInterpolate(templates: string[], vars: Record<string, string>): string {
  if (!templates || templates.length === 0) return ''
  const template = templates[0] // Profile templates use first variant (deterministic)
  let result = template
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return result
}

function buildTemplateContext(
  dimId: DimensionId,
  score: number,
  userA: ReportUserProfile,
  userB: ReportUserProfile,
  userADim?: DimensionScore,
  userBDim?: DimensionScore
): TemplateContext {
  const config = DIMENSION_CONFIGS[dimId]
  const userASubScales = userADim?.subScaleScores || {}
  const userBSubScales = userBDim?.subScaleScores || {}

  // Merge both users' sub-scales to find top and gap
  const allSubScales = { ...userASubScales }
  // Compute average sub-scale scores to determine top/gap
  const avgSubScales: Record<string, number> = {}
  for (const key of config?.subScales || []) {
    avgSubScales[key] = ((userASubScales[key] || 3.0) + (userBSubScales[key] || 3.0)) / 2
  }

  const topSubScale = getTopSubScale(avgSubScales)
  const gapSubScale = getGapSubScale(avgSubScales)

  return {
    userAName: userA.firstName,
    userBName: userB.firstName,
    score,
    tier: determineTier(score),
    dimensionName: config?.name || dimId,
    topSubScale,
    gapSubScale,
    userAAttachment: userADim?.attachmentStyle,
    userBAttachment: userBDim?.attachmentStyle,
    userAConflict: userADim?.conflictApproach,
    userBConflict: userBDim?.conflictApproach,
    userAReceiving: userADim?.loveLangProfile?.receivingLanguages[0],
    userBReceiving: userBDim?.loveLangProfile?.receivingLanguages[0],
    userAGiving: userADim?.loveLangProfile?.givingLanguages[0],
    userBGiving: userBDim?.loveLangProfile?.givingLanguages[0],
    userAScore: userADim?.overallScore || 3.0,
    userBScore: userBDim?.overallScore || 3.0,
    userASubScales,
    userBSubScales,
  }
}

function findDimensionScore(scores: DimensionScore[], dimId: DimensionId): DimensionScore | undefined {
  return scores.find((s) => s.dimensionId === dimId)
}

function getTopSubScale(subScales: Record<string, number>): string {
  let top = ''
  let topScore = -1
  for (const [key, value] of Object.entries(subScales)) {
    if (value > topScore) {
      topScore = value
      top = key
    }
  }
  return top || 'overall alignment'
}

function getGapSubScale(subScales: Record<string, number>): string {
  let gap = ''
  let gapScore = Infinity
  for (const [key, value] of Object.entries(subScales)) {
    if (value < gapScore) {
      gapScore = value
      gap = key
    }
  }
  return gap || 'general approach'
}

/** Convert snake_case sub-scale IDs to readable names */
function formatSubScaleName(subScaleId: string): string {
  const nameMap: Record<string, string> = {
    life_direction: 'life direction',
    moral_ethical: 'moral and ethical alignment',
    relationship_priority: 'relationship priority',
    anxiety: 'attachment anxiety',
    avoidance: 'attachment avoidance',
    security: 'attachment security',
    conflict_approach: 'conflict approach',
    repair_attempts: 'repair and reconnection',
    emotional_expression: 'emotional expression',
    self_awareness: 'self-awareness',
    empathy: 'empathy',
    emotional_regulation: 'emotional regulation',
    pace_of_life: 'pace of life',
    social_energy: 'social energy',
    future_orientation: 'future orientation',
    receiving_language: 'receiving love style',
    giving_language: 'giving love style',
    language_flexibility: 'language flexibility',
  }
  return nameMap[subScaleId] || subScaleId.replace(/_/g, ' ')
}

function determineTier(score: number): CISTier {
  if (score >= CIS_TIER_THRESHOLDS.rare.min) return 'rare'
  if (score >= CIS_TIER_THRESHOLDS.synergistic.min) return 'synergistic'
  if (score >= CIS_TIER_THRESHOLDS.compatible.min) return 'compatible'
  return 'misaligned'
}
