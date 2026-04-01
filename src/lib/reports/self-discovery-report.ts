// CompatibleIQ -- Self-Discovery Report Generator
// Premium $4.99 product: personal insight report for individual users
// All narratives are template-driven -- no AI API calls

import { createClient } from '@supabase/supabase-js'
import { DIMENSION_CONFIGS } from '../scoring/constants'
import type {
  DimensionId,
  DimensionScore,
  AttachmentStyle,
  ConflictApproach,
  LoveLanguage,
  LoveLanguageProfile,
} from '../scoring/types'

// ═══════════════════════════════════════════
// Report Types
// ═══════════════════════════════════════════

export interface SelfDiscoveryReport {
  id: string
  userId: string
  firstName: string
  generatedAt: string
  datingReadinessScore: number
  datingReadinessNarrative: string
  sections: {
    whoYouAre: ReportSection
    howYouAttach: ReportSection
    howYouFight: ReportSection
    yourEmotionalRange: ReportSection
    whatYouNeed: ReportSection
    growthEdges: ReportSection
    datingReadiness: ReportSection
  }
  dimensionSummaries: DimensionSummary[]
  attachmentStyle: string
  attachmentStyleLabel: string
  dominantConflictStyle: string
  dominantConflictStyleLabel: string
  eqBreakdown: Record<string, number>
  loveLanguageRanking: { language: string; label: string; percentage: number }[]
  valuesProfile: Record<string, number>
  topTraits: string[]
}

export interface ReportSection {
  title: string
  narrative: string
  highlights: string[]
  accentColor?: string
}

export interface DimensionSummary {
  dimensionId: DimensionId
  dimensionName: string
  score: number
  label: string
}

// ═══════════════════════════════════════════
// Attachment Style Labels & Descriptions
// ═══════════════════════════════════════════

const ATTACHMENT_LABELS: Record<string, string> = {
  secure: 'Secure',
  anxious_preoccupied: 'Anxious-Preoccupied',
  dismissive_avoidant: 'Dismissive-Avoidant',
  fearful_avoidant: 'Fearful-Avoidant',
  earned_secure: 'Earned Secure',
}

const ATTACHMENT_DESCRIPTIONS: Record<string, string> = {
  secure: 'You approach relationships from a place of confidence and trust. You\'re comfortable with intimacy and interdependence, and you don\'t spend energy worrying about whether your partner will be there for you. This doesn\'t mean you\'re never anxious -- it means your baseline is calm. You can tolerate distance without interpreting it as rejection, and you can be close without losing yourself. Partners tend to feel at ease around you because you don\'t pull or push -- you\'re just present.',
  anxious_preoccupied: 'You feel deeply and attach quickly. When you care about someone, you want to know you matter to them -- and silence or distance can feel like a threat. You may find yourself reading into texts, seeking reassurance, or feeling a pull to close the gap when things feel uncertain. This isn\'t weakness -- it\'s a nervous system that\'s tuned to connection. Your gift is emotional availability; your growth edge is learning to self-soothe when the relationship feels uncertain.',
  dismissive_avoidant: 'You value your independence and tend to feel most comfortable when you have space. Closeness can feel like pressure, and you may instinctively pull back when a partner moves toward you emotionally. You\'re often self-reliant to a fault -- capable and competent, but sometimes at the cost of letting someone in. Your gift is stability and groundedness; your growth edge is learning that needing someone doesn\'t mean losing yourself.',
  fearful_avoidant: 'You want closeness but fear it in equal measure. You may oscillate between reaching for your partner and pulling away, sometimes within the same conversation. Past experiences have taught you that love comes with risk, and your nervous system hasn\'t fully decided whether to lean in or protect. Your gift is emotional depth and self-awareness; your growth edge is building trust that vulnerability won\'t always lead to pain.',
  earned_secure: 'You weren\'t always this steady. You\'ve done the work -- through therapy, self-reflection, or hard-won experience -- to move toward a more secure way of relating. Your history includes insecure patterns, but you\'ve learned to recognize and override them. This is arguably the most impressive attachment profile: you know what it\'s like to struggle with trust or intimacy, and you\'ve built the skills to navigate it anyway.',
}

// ═══════════════════════════════════════════
// Conflict Style Labels & Descriptions
// ═══════════════════════════════════════════

const CONFLICT_LABELS: Record<string, string> = {
  confronter: 'Confronter',
  avoider: 'Avoider',
  collaborator: 'Collaborator',
  accommodator: 'Accommodator',
  unclassified: 'Adaptive',
}

const CONFLICT_DESCRIPTIONS: Record<string, string> = {
  confronter: 'You face conflict directly. When something is bothering you, you\'d rather address it now than let it fester. This is a genuine strength -- avoidance kills more relationships than disagreement. The flip side is that your directness can sometimes overwhelm a partner who processes more slowly or needs space before engaging. Your growth edge: learning to read the room before launching into the conversation.',
  avoider: 'You tend to sidestep conflict, not because you don\'t care, but because confrontation feels high-stakes. You may go quiet, change the subject, or agree to keep the peace. In the short term, this reduces friction. In the long term, it can lead to resentment -- yours and your partner\'s. Your growth edge: building the muscle to say the uncomfortable thing before it becomes a bigger thing.',
  collaborator: 'You approach conflict as a problem to solve together. You naturally look for win-win solutions and tend to de-escalate rather than dig in. This is the gold standard for relationship communication -- the Gottman lab would high-five you. Your growth edge: making sure your collaborative instinct doesn\'t become people-pleasing. Sometimes the right answer is to hold your ground.',
  accommodator: 'You prioritize your partner\'s needs in conflict, often yielding to keep harmony. This comes from a good place -- you genuinely want the other person to be happy. The risk is that you may suppress your own needs until they surface as resentment or withdrawal. Your growth edge: learning that expressing what you need isn\'t selfish -- it\'s essential.',
  unclassified: 'You don\'t have a single dominant conflict style, which means you\'re adaptable. Depending on the situation, you may confront, accommodate, or collaborate. This flexibility is an asset -- but it can also mean you lack a reliable default when stress is high. Your growth edge: building a conscious preference for collaboration so you have a home base when things get heated.',
}

// ═══════════════════════════════════════════
// How You Connect Labels (Affection Preferences)
// ═══════════════════════════════════════════

const LOVE_STYLE_LABELS: Record<string, string> = {
  verbal_appreciation: 'Verbal Appreciation',
  thoughtful_actions: 'Thoughtful Actions',
  meaningful_gestures: 'Meaningful Gestures',
  focused_presence: 'Focused Presence',
  physical_closeness: 'Physical Closeness',
}

const LOVE_STYLE_IMPLICATIONS: Record<string, string> = {
  verbal_appreciation: 'You feel most loved when a partner verbalizes their appreciation, admiration, and affection. A genuine compliment or a heartfelt "I\'m proud of you" lands deeper than any gift. In a relationship, you\'ll need a partner who isn\'t afraid to express themselves verbally -- and who understands that your need to hear it isn\'t insecurity, it\'s your connection style.',
  thoughtful_actions: 'You feel most loved when a partner shows up through action -- taking something off your plate, handling a chore without being asked, or making your life tangibly easier. Words are nice, but follow-through is what makes you feel secure. In a relationship, you\'ll need a partner who demonstrates love through what they do, not just what they say.',
  meaningful_gestures: 'You feel most loved through thoughtful gestures and tokens of affection. It\'s not about materialism -- it\'s about the thought behind it. A $5 coffee that shows someone was thinking about you can mean more than an expensive gift chosen without care. In a relationship, you\'ll need a partner who understands that small, intentional gestures are how you feel remembered.',
  focused_presence: 'You feel most loved when a partner is fully present -- phone down, eye contact, undivided attention. It\'s not about doing elaborate things together; it\'s about being together without distraction. In a relationship, you\'ll need a partner who prioritizes presence over productivity and who understands that half-attention feels worse than no attention.',
  physical_closeness: 'You feel most loved through physical connection -- a hand on your back, a spontaneous hug, sitting close on the couch. Touch is how your nervous system registers safety and belonging. In a relationship, you\'ll need a partner who is naturally physically affectionate and who understands that touch isn\'t just a precursor to intimacy -- it\'s its own form of connection.',
}

// ═══════════════════════════════════════════
// Main Entry Point
// ═══════════════════════════════════════════

export async function generateSelfDiscoveryReport(
  userId: string
): Promise<SelfDiscoveryReport> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    throw new Error(`Profile not found for user: ${userId}`)
  }

  const firstName = profile.first_name || 'You'

  // Fetch all dimension scores
  const { data: scoreRows, error: scoresError } = await supabase
    .from('dimension_scores')
    .select('*')
    .eq('user_id', userId)

  if (scoresError) {
    throw new Error(`Failed to fetch scores: ${scoresError.message}`)
  }

  if (!scoreRows || scoreRows.length < 6) {
    throw new Error('All 6 assessments must be completed before generating a report')
  }

  // Transform into DimensionScore map
  const dimensions = transformScores(scoreRows)

  // Extract key profiles
  const attachmentDim = dimensions.get('attachment')
  const commDim = dimensions.get('communication')
  const eiDim = dimensions.get('emotional_intelligence')
  const valuesDim = dimensions.get('values')
  const loveLangDim = dimensions.get('how_you_love')
  const lifestyleDim = dimensions.get('lifestyle_ambition')

  const attachmentStyle = attachmentDim?.attachmentStyle || 'secure'
  const conflictApproach = commDim?.conflictApproach || 'collaborator'

  // Compute EQ breakdown
  const eqBreakdown: Record<string, number> = {
    self_awareness: eiDim?.subScaleScores?.self_awareness || 3.0,
    self_regulation: eiDim?.subScaleScores?.emotional_regulation || 3.0,
    empathy: eiDim?.subScaleScores?.empathy || 3.0,
    social_skills: ((eiDim?.subScaleScores?.empathy || 3.0) + (eiDim?.subScaleScores?.self_awareness || 3.0)) / 2,
  }

  // Compute values profile for radar chart
  const valuesProfile: Record<string, number> = {
    life_direction: valuesDim?.subScaleScores?.life_direction || 3.0,
    moral_ethical: valuesDim?.subScaleScores?.moral_ethical || 3.0,
    relationship_priority: valuesDim?.subScaleScores?.relationship_priority || 3.0,
  }

  // Build love style ranking
  const loveLanguageRanking = buildLoveLanguageRanking(loveLangDim)

  // Compute dimension summaries
  const dimensionSummaries = buildDimensionSummaries(dimensions)

  // Compute dating readiness (composite of all dimension scores)
  const datingReadinessScore = computeDatingReadiness(dimensions)

  // Determine top 3 traits
  const topTraits = determineTopTraits(dimensions, attachmentStyle, conflictApproach)

  // Build report sections
  const whoYouAre = buildWhoYouAre(firstName, valuesDim, lifestyleDim)
  const howYouAttach = buildHowYouAttach(firstName, attachmentStyle)
  const howYouFight = buildHowYouFight(firstName, conflictApproach, commDim)
  const yourEmotionalRange = buildEmotionalRange(firstName, eiDim, eqBreakdown)
  const whatYouNeed = buildWhatYouNeed(firstName, loveLangDim, loveLanguageRanking)
  const growthEdges = buildGrowthEdges(firstName, dimensions, attachmentStyle, conflictApproach)
  const datingReadiness = buildDatingReadinessSection(firstName, datingReadinessScore, dimensions)

  const reportId = `sdr_${userId}_${Date.now()}`

  return {
    id: reportId,
    userId,
    firstName,
    generatedAt: new Date().toISOString(),
    datingReadinessScore,
    datingReadinessNarrative: datingReadiness.narrative,
    sections: {
      whoYouAre,
      howYouAttach,
      howYouFight,
      yourEmotionalRange,
      whatYouNeed,
      growthEdges,
      datingReadiness,
    },
    dimensionSummaries,
    attachmentStyle,
    attachmentStyleLabel: ATTACHMENT_LABELS[attachmentStyle] || 'Unknown',
    dominantConflictStyle: conflictApproach,
    dominantConflictStyleLabel: CONFLICT_LABELS[conflictApproach] || 'Unknown',
    eqBreakdown,
    loveLanguageRanking,
    valuesProfile,
    topTraits,
  }
}

// ═══════════════════════════════════════════
// Data Transformation
// ═══════════════════════════════════════════

function transformScores(dbScores: any[]): Map<DimensionId, DimensionScore> {
  const map = new Map<DimensionId, DimensionScore>()

  for (const row of dbScores) {
    const dimId = row.dimension_id as DimensionId
    const config = DIMENSION_CONFIGS[dimId]
    if (!config) continue

    const subScales = typeof row.sub_scale_scores === 'string'
      ? JSON.parse(row.sub_scale_scores)
      : row.sub_scale_scores || {}

    map.set(dimId, {
      dimensionId: dimId,
      dimensionName: config.name,
      overallScore: row.overall_score || 3.0,
      subScaleScores: subScales,
      attachmentStyle: subScales.attachment_style || subScales.style,
      conflictApproach: subScales.conflict_approach || subScales.approach,
      loveLangProfile: subScales.love_lang_profile || subScales.loveLangProfile,
    })
  }

  return map
}

function buildLoveLanguageRanking(
  loveLangDim?: DimensionScore
): { language: string; label: string; percentage: number }[] {
  const allLanguages: LoveLanguage[] = [
    'verbal_appreciation',
    'thoughtful_actions',
    'meaningful_gestures',
    'focused_presence',
    'physical_closeness',
  ]

  const profile = loveLangDim?.loveLangProfile
  if (!profile) {
    // Even distribution
    return allLanguages.map((lang) => ({
      language: lang,
      label: LOVE_STYLE_LABELS[lang],
      percentage: 20,
    }))
  }

  const tally = profile.receivingTally || {} as Record<string, number>
  const total = Object.values(tally).reduce((sum: number, v: number) => sum + v, 0) || 1

  return allLanguages
    .map((lang) => ({
      language: lang,
      label: LOVE_STYLE_LABELS[lang],
      percentage: Math.round(((tally[lang] || 0) / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
}

function buildDimensionSummaries(
  dimensions: Map<DimensionId, DimensionScore>
): DimensionSummary[] {
  const dimIds: DimensionId[] = [
    'values',
    'attachment',
    'communication',
    'emotional_intelligence',
    'lifestyle_ambition',
    'how_you_love',
  ]

  return dimIds.map((dimId) => {
    const dim = dimensions.get(dimId)
    const config = DIMENSION_CONFIGS[dimId]
    const score = dim?.overallScore || 3.0
    const normalized = Math.round((score / 5) * 100)

    return {
      dimensionId: dimId,
      dimensionName: config?.name || dimId,
      score: normalized,
      label: normalized >= 80 ? 'Strong' : normalized >= 60 ? 'Solid' : normalized >= 40 ? 'Developing' : 'Growth Area',
    }
  })
}

function computeDatingReadiness(dimensions: Map<DimensionId, DimensionScore>): number {
  // Weighted composite: attachment security and EQ matter most
  const weights: Partial<Record<DimensionId, number>> = {
    values: 0.12,
    attachment: 0.28,
    communication: 0.20,
    emotional_intelligence: 0.22,
    lifestyle_ambition: 0.08,
    how_you_love: 0.10,
  }

  let totalScore = 0
  let totalWeight = 0

  for (const [dimId, weight] of Object.entries(weights)) {
    const dim = dimensions.get(dimId as DimensionId)
    if (dim) {
      totalScore += (dim.overallScore / 5) * 100 * weight
      totalWeight += weight
    }
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50
}

function determineTopTraits(
  dimensions: Map<DimensionId, DimensionScore>,
  attachmentStyle: string,
  conflictApproach: string
): string[] {
  const traits: string[] = []

  // Attachment-derived trait
  if (attachmentStyle === 'secure' || attachmentStyle === 'earned_secure') {
    traits.push('Emotionally Grounded')
  } else if (attachmentStyle === 'anxious_preoccupied') {
    traits.push('Deeply Connected')
  } else if (attachmentStyle === 'dismissive_avoidant') {
    traits.push('Self-Reliant')
  } else {
    traits.push('Emotionally Complex')
  }

  // EI-derived trait
  const eiDim = dimensions.get('emotional_intelligence')
  if (eiDim && eiDim.overallScore >= 3.8) {
    traits.push('High EQ')
  } else if (eiDim && eiDim.subScaleScores?.empathy >= 4.0) {
    traits.push('Highly Empathetic')
  } else {
    traits.push('Self-Aware')
  }

  // Values/lifestyle trait
  const valuesDim = dimensions.get('values')
  if (valuesDim) {
    const relPriority = valuesDim.subScaleScores?.relationship_priority || 3.0
    const lifeDir = valuesDim.subScaleScores?.life_direction || 3.0
    if (relPriority >= 4.0) {
      traits.push('Relationship-Focused')
    } else if (lifeDir >= 4.0) {
      traits.push('Ambitious')
    } else {
      traits.push('Balanced')
    }
  }

  return traits.slice(0, 3)
}

// ═══════════════════════════════════════════
// Section Generators
// ═══════════════════════════════════════════

function buildWhoYouAre(
  name: string,
  valuesDim?: DimensionScore,
  lifestyleDim?: DimensionScore
): ReportSection {
  const highlights: string[] = []
  let narrative = `${name}, your values and priorities form the foundation of who you are in relationships.`

  if (valuesDim) {
    const lifeDir = valuesDim.subScaleScores?.life_direction || 3.0
    const moral = valuesDim.subScaleScores?.moral_ethical || 3.0
    const relPriority = valuesDim.subScaleScores?.relationship_priority || 3.0

    if (lifeDir >= 4.0) {
      narrative += ` You have a strong sense of direction in life -- you know where you're headed and you need a partner who respects that trajectory.`
      highlights.push('Strong life direction and career orientation')
    } else if (lifeDir >= 3.0) {
      narrative += ` You have a clear but flexible sense of direction. You know what matters to you, but you're open to how the path unfolds.`
      highlights.push('Balanced life direction with flexibility')
    } else {
      narrative += ` You're in a season of exploration, which is valuable self-knowledge. You're not locked into a rigid path, which gives you freedom to find alignment with the right partner.`
      highlights.push('Open to new directions and growth')
    }

    if (moral >= 4.0) {
      highlights.push('Strong moral and ethical compass')
      narrative += ` Your moral and ethical standards are a non-negotiable for you -- you need a partner whose integrity matches your own.`
    }

    if (relPriority >= 4.0) {
      highlights.push('Relationships are a top priority')
      narrative += ` You place a high priority on your relationships, which means you'll invest the time and energy needed to make them work.`
    } else if (relPriority <= 2.5) {
      highlights.push('Independent and self-focused')
      narrative += ` You tend to prioritize individual pursuits over relationship investment. This isn't a flaw -- but it's important information for the kind of partner who will thrive with you.`
    }
  }

  if (lifestyleDim) {
    const pace = lifestyleDim.subScaleScores?.pace_of_life || 3.0
    const social = lifestyleDim.subScaleScores?.social_energy || 3.0

    if (pace >= 4.0) {
      highlights.push('High-energy, fast-paced lifestyle')
    } else if (pace <= 2.5) {
      highlights.push('Prefers a slower, more intentional pace')
    }

    if (social >= 4.0) {
      highlights.push('Socially energized and outgoing')
    } else if (social <= 2.5) {
      highlights.push('Values solitude and smaller social circles')
    }
  }

  if (highlights.length === 0) {
    highlights.push('Well-rounded value system', 'Adaptable priorities')
  }

  return {
    title: 'Who You Are',
    narrative,
    highlights,
  }
}

function buildHowYouAttach(name: string, style: string): ReportSection {
  const styleLabel = ATTACHMENT_LABELS[style] || 'Unknown'
  const description = ATTACHMENT_DESCRIPTIONS[style] || ''
  const highlights: string[] = []

  if (style === 'secure' || style === 'earned_secure') {
    highlights.push(
      'Comfortable with closeness and independence',
      'Can self-soothe without shutting down',
      'Partners feel safe and un-pressured around you'
    )
  } else if (style === 'anxious_preoccupied') {
    highlights.push(
      'Emotionally available and invested',
      'May need extra reassurance during uncertainty',
      'Reads emotional cues quickly (sometimes too quickly)'
    )
  } else if (style === 'dismissive_avoidant') {
    highlights.push(
      'Self-reliant and emotionally stable',
      'May pull back when things get too close',
      'Values autonomy highly in relationships'
    )
  } else if (style === 'fearful_avoidant') {
    highlights.push(
      'Deeply emotional with strong self-awareness potential',
      'May oscillate between closeness and distance',
      'Benefits most from a patient, consistent partner'
    )
  }

  return {
    title: 'How You Attach',
    narrative: `Your attachment style is ${styleLabel}. ${description}`,
    highlights,
  }
}

function buildHowYouFight(
  name: string,
  approach: string,
  commDim?: DimensionScore
): ReportSection {
  const approachLabel = CONFLICT_LABELS[approach] || 'Unknown'
  const description = CONFLICT_DESCRIPTIONS[approach] || ''
  const highlights: string[] = []

  highlights.push(`Dominant conflict style: ${approachLabel}`)

  if (commDim) {
    const repair = commDim.subScaleScores?.repair_attempts || 3.0
    const expression = commDim.subScaleScores?.emotional_expression || 3.0

    if (repair >= 4.0) {
      highlights.push('Strong repair skills -- you know how to reconnect after a fight')
    } else if (repair <= 2.5) {
      highlights.push('Repair after conflict is a growth area')
    }

    if (expression >= 4.0) {
      highlights.push('Emotionally expressive and open')
    } else if (expression <= 2.5) {
      highlights.push('Tends to hold emotions close to the chest')
    }
  }

  return {
    title: 'How You Fight',
    narrative: `Your dominant conflict approach is ${approachLabel}. ${description}`,
    highlights,
  }
}

function buildEmotionalRange(
  name: string,
  eiDim?: DimensionScore,
  eqBreakdown?: Record<string, number>
): ReportSection {
  const highlights: string[] = []
  let narrative = ''

  const overall = eiDim?.overallScore || 3.0

  if (overall >= 4.0) {
    narrative = `${name}, your emotional intelligence is a genuine asset. You have a strong capacity for self-awareness, empathy, and emotional regulation -- the trifecta that predicts healthy, lasting relationships. You can read a room, manage your own reactivity, and extend understanding to others even when you disagree.`
    highlights.push('High emotional intelligence across all sub-scales')
  } else if (overall >= 3.0) {
    narrative = `${name}, your emotional intelligence is solid with room to grow. You have real strengths -- particularly in the areas where you scored highest -- but there are also blind spots that will show up under stress.`

    if (eqBreakdown) {
      const sorted = Object.entries(eqBreakdown).sort((a, b) => b[1] - a[1])
      const topArea = formatSubScaleName(sorted[0][0])
      const gapArea = formatSubScaleName(sorted[sorted.length - 1][0])
      highlights.push(`Strongest EQ area: ${topArea}`)
      highlights.push(`Growth area: ${gapArea}`)
      narrative += ` Your strongest area is ${topArea}, which serves as a foundation. Your growth edge is ${gapArea}, which will benefit from intentional practice.`
    }
  } else {
    narrative = `${name}, emotional intelligence is your biggest growth opportunity. The good news: EQ is the most trainable of all the dimensions we measure. Unlike attachment style, which takes years to shift, emotional intelligence responds relatively quickly to practice and awareness.`
    highlights.push('EQ is a growth priority')

    if (eqBreakdown) {
      const sorted = Object.entries(eqBreakdown).sort((a, b) => b[1] - a[1])
      const topArea = formatSubScaleName(sorted[0][0])
      highlights.push(`Build on your strength in ${topArea}`)
    }
  }

  return {
    title: 'Your Emotional Range',
    narrative,
    highlights,
  }
}

function buildWhatYouNeed(
  name: string,
  loveLangDim?: DimensionScore,
  ranking?: { language: string; label: string; percentage: number }[]
): ReportSection {
  const highlights: string[] = []
  let narrative = ''

  if (ranking && ranking.length > 0) {
    const primary = ranking[0]
    const secondary = ranking.length > 1 ? ranking[1] : null

    narrative = `Your primary connection style is ${primary.label}. ${LOVE_STYLE_IMPLICATIONS[primary.language] || ''}`

    highlights.push(`Primary: ${primary.label} (${primary.percentage}%)`)
    if (secondary && secondary.percentage > 10) {
      highlights.push(`Secondary: ${secondary.label} (${secondary.percentage}%)`)
      narrative += ` Your secondary style, ${secondary.label}, also plays an important role -- a partner who can express both will make you feel deeply understood.`
    }
  } else {
    narrative = `${name}, your connection style profile shows a balanced distribution, meaning you respond to multiple forms of affection without a strong dominant preference. This can be an asset -- you're adaptable -- but it also means you may need to communicate more explicitly about what makes you feel loved in any given moment.`
    highlights.push('Balanced connection style profile -- responsive to multiple forms')
  }

  const flexibility = loveLangDim?.loveLangProfile?.flexibilityScore || 3.0
  if (flexibility >= 4.0) {
    highlights.push('High flexibility -- you can adapt to a partner\'s connection style')
  } else if (flexibility <= 2.5) {
    highlights.push('Lower flexibility -- you need a partner who matches your connection style')
  }

  return {
    title: 'What You Need',
    narrative,
    highlights,
  }
}

function buildGrowthEdges(
  name: string,
  dimensions: Map<DimensionId, DimensionScore>,
  attachmentStyle: string,
  conflictApproach: string
): ReportSection {
  const highlights: string[] = []
  let narrative = `Every profile has growth edges -- areas where self-awareness and intentional practice can move the needle on your relationship outcomes. Here are yours:`

  // Find the lowest dimension
  const dimEntries = Array.from(dimensions.entries())
  const sorted = dimEntries.sort((a, b) => a[1].overallScore - b[1].overallScore)

  if (sorted.length > 0) {
    const weakest = sorted[0]
    const config = DIMENSION_CONFIGS[weakest[0]]
    if (config) {
      highlights.push(`${config.name} is your lowest-scoring dimension -- this is where you'll see the biggest return on investment`)
    }
  }

  // Attachment-specific growth edges
  if (attachmentStyle === 'anxious_preoccupied') {
    highlights.push('Practice self-soothing before seeking reassurance from a partner')
    highlights.push('Build tolerance for ambiguity in early dating')
  } else if (attachmentStyle === 'dismissive_avoidant') {
    highlights.push('Practice leaning into vulnerability rather than pulling away')
    highlights.push('Notice when independence becomes isolation')
  } else if (attachmentStyle === 'fearful_avoidant') {
    highlights.push('Work with a therapist on building a consistent relationship pattern')
    highlights.push('Learn to distinguish past-based fear from present-based intuition')
  }

  // Conflict-specific growth edges
  if (conflictApproach === 'avoider') {
    highlights.push('Practice expressing disagreement in low-stakes situations to build the muscle')
  } else if (conflictApproach === 'confronter') {
    highlights.push('Develop a pause habit -- count to 10 before launching into a difficult conversation')
  }

  // EI growth edges
  const eiDim = dimensions.get('emotional_intelligence')
  if (eiDim && eiDim.overallScore < 3.0) {
    highlights.push('Emotional intelligence is your biggest lever -- consider journaling or mindfulness practice')
  }

  return {
    title: 'Your Growth Edges',
    narrative,
    highlights,
    accentColor: '#E8735A', // coral
  }
}

function buildDatingReadinessSection(
  name: string,
  score: number,
  dimensions: Map<DimensionId, DimensionScore>
): ReportSection {
  const highlights: string[] = []
  let narrative = ''

  if (score >= 80) {
    narrative = `${name}, your Dating Readiness Score is ${score}/100 -- you're in a strong position to build a healthy relationship. Your assessment profile shows emotional maturity, self-awareness, and the communication skills that predict long-term success. You're not just ready to date -- you're ready to date well.`
    highlights.push('High readiness across all dimensions')
    highlights.push('Strong foundation for a healthy relationship')
  } else if (score >= 60) {
    narrative = `${name}, your Dating Readiness Score is ${score}/100 -- you have a solid foundation with specific areas to develop. You're ready to date, but you'll get the most out of it if you stay conscious of your growth edges. The self-awareness you've built through this assessment is itself a sign of readiness.`
    highlights.push('Solid foundation with identified growth areas')
    highlights.push('Self-awareness is a sign of readiness')
  } else if (score >= 40) {
    narrative = `${name}, your Dating Readiness Score is ${score}/100. This doesn't mean you shouldn't date -- but it does mean you'll benefit from doing some personal development work in parallel. The areas where you scored lower aren't permanent -- they're skills that can be developed with awareness and practice.`
    highlights.push('Consider working on growth areas before diving in')
    highlights.push('These patterns can shift with intentional effort')
  } else {
    narrative = `${name}, your Dating Readiness Score is ${score}/100. This suggests that investing in personal growth right now will pay massive dividends in your future relationships. Focus on the growth edges identified in this report -- particularly attachment security and emotional intelligence -- before entering the dating pool.`
    highlights.push('Personal growth is the priority right now')
    highlights.push('Focus on attachment security and emotional intelligence')
  }

  return {
    title: 'Dating Readiness Assessment',
    narrative,
    highlights,
  }
}

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function formatSubScaleName(subScaleId: string): string {
  const nameMap: Record<string, string> = {
    self_awareness: 'Self-Awareness',
    self_regulation: 'Self-Regulation',
    emotional_regulation: 'Emotional Regulation',
    empathy: 'Empathy',
    social_skills: 'Social Skills',
    life_direction: 'Life Direction',
    moral_ethical: 'Moral & Ethical Alignment',
    relationship_priority: 'Relationship Priority',
    anxiety: 'Attachment Anxiety',
    avoidance: 'Attachment Avoidance',
    security: 'Attachment Security',
    conflict_approach: 'Conflict Approach',
    repair_attempts: 'Repair & Reconnection',
    emotional_expression: 'Emotional Expression',
    pace_of_life: 'Pace of Life',
    social_energy: 'Social Energy',
    future_orientation: 'Future Orientation',
    receiving_language: 'Receiving Connection Style',
    giving_language: 'Giving Connection Style',
    language_flexibility: 'Connection Flexibility',
  }
  return nameMap[subScaleId] || subScaleId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
