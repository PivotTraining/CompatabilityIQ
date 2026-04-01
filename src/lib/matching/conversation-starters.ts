// CompatibleIQ -- AI-powered conversation starters for new matches
// Generates personalized icebreakers based on assessment dimension scores

// ═══════════════════════════════════════════
// Types
// ═══════════════════════════════════════════

export interface ConversationStarter {
  text: string
  category: 'values' | 'lifestyle' | 'connection' | 'fun'
  icon: string
}

type DimensionKey =
  | 'values'
  | 'attachment'
  | 'communication'
  | 'emotional_intelligence'
  | 'lifestyle_ambition'
  | 'how_you_love'

// ═══════════════════════════════════════════
// Dimension Metadata
// ═══════════════════════════════════════════

interface DimensionMeta {
  category: ConversationStarter['category']
  icon: string
  similarPrompts: readonly string[]
  differentPrompts: readonly string[]
}

const DIMENSION_META: Record<DimensionKey, DimensionMeta> = {
  values: {
    category: 'values',
    icon: '\u{1F3AF}',
    similarPrompts: [
      'You both place a high priority on your core values \u2014 ask what principle they would never compromise on.',
      'You share a strong sense of direction in life \u2014 ask about the dream they are most excited to chase.',
      'Your priorities seem closely aligned \u2014 ask what "success" looks like to them in five years.',
    ],
    differentPrompts: [
      'You see the world through different lenses \u2014 ask what shaped their most deeply held belief.',
      'Your priorities reflect unique life paths \u2014 ask what experience most changed how they see the world.',
      'You bring different perspectives to the table \u2014 ask what value they wish more people understood.',
    ],
  },
  attachment: {
    category: 'connection',
    icon: '\u{1F91D}',
    similarPrompts: [
      'You both seem comfortable building closeness \u2014 ask what makes them feel most secure in a relationship.',
      'You share a similar rhythm when it comes to connection \u2014 ask how they like to show they care.',
      'You both value emotional safety \u2014 ask what "being there" for someone looks like to them.',
    ],
    differentPrompts: [
      'You approach closeness in your own ways \u2014 ask what helps them feel safe when opening up.',
      'You might move at different speeds emotionally \u2014 ask what their ideal pace looks like early on.',
      'Your comfort zones around vulnerability differ \u2014 ask what trust looks like to them.',
    ],
  },
  communication: {
    category: 'connection',
    icon: '\u{1F4AC}',
    similarPrompts: [
      'You both seem to handle tough conversations in a similar style \u2014 ask how they prefer to work through a disagreement.',
      'You share a communication wavelength \u2014 ask what the best conversation they have ever had was about.',
      'Your conflict styles are well-matched \u2014 ask what "fighting fair" means to them.',
    ],
    differentPrompts: [
      'You approach conflict differently \u2014 ask how they like to resolve disagreements.',
      'Your communication styles bring balance \u2014 ask what they need most during a difficult conversation.',
      'You express yourself in different ways \u2014 ask whether they process things out loud or internally first.',
    ],
  },
  emotional_intelligence: {
    category: 'connection',
    icon: '\u{1F9E0}',
    similarPrompts: [
      'You both score high on self-awareness \u2014 ask about a moment that taught them something surprising about themselves.',
      'You share a strong empathetic streak \u2014 ask what emotion they find hardest to sit with in someone else.',
      'You both value emotional depth \u2014 ask what "emotional maturity" means to them.',
    ],
    differentPrompts: [
      'You bring different emotional strengths \u2014 ask what helps them decompress after a tough day.',
      'Your emotional toolkits look different \u2014 ask how they learned to manage their feelings.',
      'You process emotions in your own ways \u2014 ask what they do when they need to recharge.',
    ],
  },
  lifestyle_ambition: {
    category: 'lifestyle',
    icon: '\u{1F680}',
    similarPrompts: [
      'You both have a similar pace of life \u2014 ask what their perfect weekend looks like.',
      'Your ambition levels are well-matched \u2014 ask what project or goal they are most excited about right now.',
      'You share a similar lifestyle energy \u2014 ask whether they are an early bird or a night owl.',
    ],
    differentPrompts: [
      'You bring different energies to daily life \u2014 ask what a "full" day looks like for them.',
      'Your lifestyles balance each other \u2014 ask what they wish they had more time for.',
      'You approach ambition differently \u2014 ask what drives them when things get hard.',
    ],
  },
  how_you_love: {
    category: 'fun',
    icon: '\u{1F496}',
    similarPrompts: [
      'You both show love in similar ways \u2014 ask what the most thoughtful thing someone has done for them is.',
      'Your connection styles are a natural fit \u2014 ask what small gesture always makes their day.',
      'You speak a similar love language \u2014 ask how they most like to celebrate someone they care about.',
    ],
    differentPrompts: [
      'You express affection in your own unique ways \u2014 ask what makes them feel most appreciated.',
      'Your love languages are different, which means you can learn from each other \u2014 ask what gesture from a partner has stuck with them.',
      'You show care differently \u2014 ask what their idea of a perfect date night would be.',
    ],
  },
} as const

// ═══════════════════════════════════════════
// Similarity Threshold
// ═══════════════════════════════════════════

/** Scores within this range are considered "similar" */
const SIMILARITY_THRESHOLD = 0.8

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function isSimilar(scoreA: number, scoreB: number): boolean {
  return Math.abs(scoreA - scoreB) <= SIMILARITY_THRESHOLD
}

/**
 * Deterministically pick a prompt index based on the two scores.
 * Avoids Math.random so the output is stable for the same input.
 */
function pickIndex(scoreA: number, scoreB: number, poolSize: number): number {
  const combined = Math.round((scoreA + scoreB) * 100)
  return combined % poolSize
}

/**
 * Score each dimension by how "interesting" it is for conversation.
 * Dimensions with very high similarity or very high difference are
 * more interesting than middling ones.
 */
function interestScore(scoreA: number, scoreB: number): number {
  const diff = Math.abs(scoreA - scoreB)
  // High similarity (diff near 0) or high contrast (diff near max) are both interesting
  return diff <= SIMILARITY_THRESHOLD ? 2.0 + (SIMILARITY_THRESHOLD - diff) : diff
}

// ═══════════════════════════════════════════
// Main Generator
// ═══════════════════════════════════════════

export function generateConversationStarters(
  userAScores: Record<string, number>,
  userBScores: Record<string, number>,
  _userAName: string,
  _userBName: string,
): ConversationStarter[] {
  const dimensionKeys = Object.keys(DIMENSION_META) as DimensionKey[]

  // Build scored list of available dimensions (only those with data for both users)
  const scoredDimensions = dimensionKeys
    .filter((key) => userAScores[key] != null && userBScores[key] != null)
    .map((key) => ({
      key,
      scoreA: userAScores[key],
      scoreB: userBScores[key],
      interest: interestScore(userAScores[key], userBScores[key]),
    }))
    .sort((a, b) => b.interest - a.interest)

  if (scoredDimensions.length === 0) {
    return buildFallbackStarters()
  }

  // Pick up to 3 different dimensions, ensuring category variety
  const selected: typeof scoredDimensions = []
  const usedCategories = new Set<string>()

  for (const dim of scoredDimensions) {
    if (selected.length >= 3) break
    const meta = DIMENSION_META[dim.key]
    // Prefer different categories, but allow repeats if necessary
    if (!usedCategories.has(meta.category) || selected.length >= scoredDimensions.length - 1) {
      selected.push(dim)
      usedCategories.add(meta.category)
    }
  }

  // If we still have fewer than 3 (unlikely), fill with remaining dimensions
  if (selected.length < 3) {
    for (const dim of scoredDimensions) {
      if (selected.length >= 3) break
      if (!selected.includes(dim)) {
        selected.push(dim)
      }
    }
  }

  return selected.slice(0, 3).map((dim) => {
    const meta = DIMENSION_META[dim.key]
    const similar = isSimilar(dim.scoreA, dim.scoreB)
    const prompts = similar ? meta.similarPrompts : meta.differentPrompts
    const idx = pickIndex(dim.scoreA, dim.scoreB, prompts.length)

    return {
      text: prompts[idx],
      category: meta.category,
      icon: meta.icon,
    }
  })
}

// ═══════════════════════════════════════════
// Fallback
// ═══════════════════════════════════════════

function buildFallbackStarters(): ConversationStarter[] {
  return [
    {
      text: 'What is something you are passionate about that most people do not know?',
      category: 'fun',
      icon: '\u{2728}',
    },
    {
      text: 'What does your ideal Sunday morning look like?',
      category: 'lifestyle',
      icon: '\u{2615}',
    },
    {
      text: 'What is the best piece of advice you have ever received?',
      category: 'values',
      icon: '\u{1F4A1}',
    },
  ]
}
