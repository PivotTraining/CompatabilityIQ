// CompatibleIQ -- Archetype Scoring Engine
// Computes primary + secondary archetype from dimension scores

import { ArchetypeId, ARCHETYPE_PROFILES } from './archetype-narratives'

export type { ArchetypeId }

export interface ArchetypeResult {
  primary: ArchetypeId
  secondary: ArchetypeId
  scores: Record<ArchetypeId, number>
  label: string // e.g. "Anchor-Empath"
}

interface DimensionScoreInput {
  dimensionId: string
  subScaleScores: Record<string, number>
  overallScore: number
}

// Archetype scoring weights — maps sub-scale scores to archetype contributions
const ARCHETYPE_WEIGHTS: Record<ArchetypeId, Record<string, number>> = {
  anchor: {
    // High: secure attachment, collaborative conflict, emotional regulation, stable values
    'attachment_security': 0.25,
    'conflict_collaborative': 0.20,
    'eq_self_regulation': 0.20,
    'eq_self_awareness': 0.15,
    'values_stability': 0.10,
    'love_presence': 0.10,
  },
  spark: {
    // High: adventurous values, physical connection, direct communication, excitement
    'values_adventure': 0.20,
    'love_physical': 0.20,
    'conflict_direct': 0.20,
    'hot_takes_unconventional': 0.15,
    'lifestyle_spontaneity': 0.15,
    'attachment_passion': 0.10,
  },
  builder: {
    // High: ambition, practical love, goal-oriented communication, financial alignment
    'values_career': 0.25,
    'lifestyle_ambition': 0.20,
    'love_actions': 0.20,
    'conflict_practical': 0.15,
    'hot_takes_pragmatic': 0.10,
    'eq_discipline': 0.10,
  },
  empath: {
    // High: EQ (empathy), verbal connection, nurturing, anxious-leaning attachment
    'eq_empathy': 0.25,
    'eq_social_awareness': 0.20,
    'love_verbal': 0.20,
    'conflict_accommodating': 0.15,
    'attachment_anxious': 0.10,
    'values_relationships': 0.10,
  },
  maverick: {
    // High: autonomy, unconventional values, avoidant attachment, independence
    'values_autonomy': 0.25,
    'hot_takes_unconventional': 0.20,
    'attachment_avoidant': 0.15,
    'lifestyle_independence': 0.15,
    'conflict_assertive': 0.15,
    'love_freedom': 0.10,
  },
}

// Map dimension sub-scales to archetype trait keys
function mapSubScalesToTraits(dimensions: DimensionScoreInput[]): Record<string, number> {
  const traits: Record<string, number> = {}

  for (const dim of dimensions) {
    const scores = dim.subScaleScores || {}
    const overall = dim.overallScore || 50

    switch (dim.dimensionId) {
      case 'values':
        traits['values_stability'] = scores['life_direction'] ?? overall
        traits['values_career'] = scores['career_focus'] ?? overall
        traits['values_adventure'] = scores['openness'] ?? (100 - (scores['stability'] ?? (100 - overall)))
        traits['values_autonomy'] = scores['independence'] ?? overall
        traits['values_relationships'] = scores['relationship_priority'] ?? overall
        break

      case 'attachment':
        traits['attachment_security'] = scores['security'] ?? overall
        traits['attachment_anxious'] = scores['anxiety'] ?? (100 - overall)
        traits['attachment_avoidant'] = scores['avoidance'] ?? (100 - overall)
        traits['attachment_passion'] = scores['passion'] ?? overall
        break

      case 'communication':
        traits['conflict_collaborative'] = scores['collaborative'] ?? overall
        traits['conflict_direct'] = scores['confronting'] ?? overall
        traits['conflict_accommodating'] = scores['accommodating'] ?? (100 - overall)
        traits['conflict_practical'] = scores['problem_solving'] ?? overall
        traits['conflict_assertive'] = scores['assertive'] ?? overall
        break

      case 'how_you_love':
        traits['love_verbal'] = scores['verbal_connection'] ?? overall
        traits['love_presence'] = scores['presence_attention'] ?? overall
        traits['love_actions'] = scores['actions_over_words'] ?? overall
        traits['love_physical'] = scores['physical_connection'] ?? overall
        traits['love_freedom'] = 100 - (scores['thoughtful_gestures'] ?? (100 - overall))
        break

      case 'hot_takes':
        traits['hot_takes_unconventional'] = scores['unconventional'] ?? overall
        traits['hot_takes_pragmatic'] = scores['pragmatic'] ?? overall
        break

      case 'emotional_intelligence':
        traits['eq_self_awareness'] = scores['self_awareness'] ?? overall
        traits['eq_self_regulation'] = scores['self_regulation'] ?? overall
        traits['eq_empathy'] = scores['empathy'] ?? overall
        traits['eq_social_awareness'] = scores['social_skills'] ?? overall
        traits['eq_discipline'] = scores['emotional_discipline'] ?? overall
        break

      case 'lifestyle':
        traits['lifestyle_ambition'] = scores['ambition'] ?? overall
        traits['lifestyle_independence'] = scores['independence'] ?? overall
        traits['lifestyle_spontaneity'] = scores['spontaneity'] ?? overall
        break
    }
  }

  return traits
}

/**
 * Compute the user's archetype from their dimension scores
 */
export function computeArchetype(dimensions: DimensionScoreInput[]): ArchetypeResult {
  const traits = mapSubScalesToTraits(dimensions)
  const scores: Record<ArchetypeId, number> = {
    anchor: 0,
    spark: 0,
    builder: 0,
    empath: 0,
    maverick: 0,
  }

  // Score each archetype
  for (const [archetype, weights] of Object.entries(ARCHETYPE_WEIGHTS)) {
    let totalWeight = 0
    let weightedSum = 0

    for (const [trait, weight] of Object.entries(weights)) {
      const traitScore = traits[trait]
      if (traitScore !== undefined) {
        weightedSum += traitScore * weight
        totalWeight += weight
      }
    }

    scores[archetype as ArchetypeId] = totalWeight > 0
      ? Math.round(weightedSum / totalWeight)
      : 50 // default if no data
  }

  // Sort to find primary and secondary
  const sorted = (Object.entries(scores) as [ArchetypeId, number][])
    .sort((a, b) => b[1] - a[1])

  const primary = sorted[0][0]
  const secondary = sorted[1][0]

  return {
    primary,
    secondary,
    scores,
    label: `${ARCHETYPE_PROFILES[primary].name.replace('The ', '')}-${ARCHETYPE_PROFILES[secondary].name.replace('The ', '')}`,
  }
}

/**
 * Get compatibility score and narrative for two archetypes
 */
const PAIRING_SCORES: Record<string, number> = {
  'anchor-anchor': 75,
  'anchor-spark': 85,
  'anchor-builder': 80,
  'anchor-empath': 90,
  'anchor-maverick': 65,
  'spark-spark': 70,
  'spark-builder': 65,
  'spark-empath': 72,
  'spark-maverick': 85,
  'builder-builder': 75,
  'builder-empath': 70,
  'builder-maverick': 78,
  'empath-empath': 80,
  'empath-maverick': 55,
  'maverick-maverick': 60,
}

function getPairingKey(a: ArchetypeId, b: ArchetypeId): string {
  return [a, b].sort().join('-')
}

export function getArchetypePairScore(a: ArchetypeId, b: ArchetypeId): number {
  return PAIRING_SCORES[getPairingKey(a, b)] ?? 65
}

export function getArchetypeDescription(archetype: ArchetypeId) {
  return ARCHETYPE_PROFILES[archetype]
}
