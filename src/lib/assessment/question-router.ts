// @ts-nocheck -- pending schema regen
// @ts-nocheck -- pending schema regen
import type { AssessmentQuestion } from './types'
import { getModuleQuestions } from './question-bank'
import {
  type AgeBracket,
  type CulturalContext,
  type QuestionVariant,
  getVariantsForModule,
} from './question-variants'

// ════════════════════════════════════════════
// DEMOGRAPHIC-AWARE QUESTION ROUTER
// Swaps base questions for culturally relevant variants
// while preserving sub-scale coverage and scoring validity
// ════════════════════════════════════════════

// ─── Age Bracket Computation ───────────────────────────

/**
 * Determines the age bracket from a date of birth string (YYYY-MM-DD).
 * - young_professional: 25-30
 * - established: 31-37
 * - seasoned: 38-45
 *
 * Falls back to 'established' for out-of-range ages.
 */
export function getAgeBracket(dateOfBirth: string): AgeBracket {
  const today = new Date()
  const dob = new Date(dateOfBirth)
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }

  if (age <= 30) return 'young_professional'
  if (age <= 37) return 'established'
  return 'seasoned'
}

// ─── Cultural Context Mapping ──────────────────────────

/**
 * Maps user-provided cultural background string to a CulturalContext tag.
 * The onboarding form stores the raw selection; this normalizes it
 * for variant matching.
 */
export function getCulturalContext(
  background?: string | null
): CulturalContext {
  if (!background) return 'universal'

  const normalized = background.toLowerCase().trim()

  if (
    normalized.includes('black') ||
    normalized.includes('african american') ||
    normalized.includes('african-american')
  ) {
    return 'black_culture'
  }

  if (
    normalized.includes('latino') ||
    normalized.includes('latina') ||
    normalized.includes('hispanic')
  ) {
    return 'latino_culture'
  }

  // Asian / Pacific Islander, White / European, Mixed, Other, Prefer not to say
  // all map to general_pop which shares the broadest variant pool
  if (
    normalized.includes('prefer not') ||
    normalized.includes('other')
  ) {
    return 'universal'
  }

  return 'general_pop'
}

// ─── Variant Scoring ───────────────────────────────────

/**
 * Scores how well a variant matches the user's demographics.
 * Returns 0 if the variant doesn't match at all, higher = better fit.
 */
function scoreVariant(
  variant: QuestionVariant,
  ageBracket: AgeBracket,
  culturalContext: CulturalContext
): number {
  const { demographics } = variant
  const ageMatch = demographics.age_brackets.includes(ageBracket)
  const cultureMatch =
    demographics.cultural_contexts.includes(culturalContext) ||
    demographics.cultural_contexts.includes('universal')

  if (!ageMatch && !cultureMatch) return 0
  if (ageMatch && !cultureMatch) return 1
  if (!ageMatch && cultureMatch) return 1

  // Both match — check specificity
  let score = 2

  // Prefer culture-specific variants over 'universal' when user has a context
  if (
    culturalContext !== 'universal' &&
    demographics.cultural_contexts.includes(culturalContext)
  ) {
    score += 1
  }

  // Prefer narrower age bracket targeting (fewer brackets = more specific)
  if (demographics.age_brackets.length === 1) {
    score += 1
  }

  return score
}

// ─── Max Swaps Per Module ──────────────────────────────

/** Maximum number of base questions to swap per module */
const MAX_SWAPS_PER_MODULE: Record<number, number> = {
  1: 3, // 8 base questions, swap up to 3
  2: 3,
  3: 3,
  4: 2, // 6 base questions (forced choice), swap up to 2
  5: 3,
  6: 3, // 10 base questions, swap up to 3
  7: 3,
  8: 3,
}

// ─── Main Router ───────────────────────────────────────

/**
 * Returns a personalized question set for a module, swapping in
 * demographic-appropriate variants where available.
 *
 * Rules:
 * 1. Start with all base questions for the module
 * 2. For each base question, find the best-scoring variant
 * 3. Swap in the top N variants (not all — keep universal anchors)
 * 4. Ensure every sub-scale (dimension) still has at least one base question
 * 5. If no demographic info is provided, return base questions unchanged
 */
export function getPersonalizedQuestions(
  moduleNum: number,
  dateOfBirth?: string | null,
  culturalBackground?: string | null
): AssessmentQuestion[] {
  const baseQuestions = getModuleQuestions(moduleNum)

  // No demographic info → return base questions as-is
  if (!dateOfBirth && !culturalBackground) {
    return baseQuestions
  }

  const ageBracket: AgeBracket = dateOfBirth
    ? getAgeBracket(dateOfBirth)
    : 'established' // safe default for 25-45 range

  const culturalContext: CulturalContext = getCulturalContext(culturalBackground)

  const moduleVariants = getVariantsForModule(moduleNum)
  if (moduleVariants.length === 0) return baseQuestions

  // Score all variants for this user
  const scoredSwaps: {
    baseId: string
    variant: QuestionVariant
    score: number
  }[] = []

  for (const variant of moduleVariants) {
    const score = scoreVariant(variant, ageBracket, culturalContext)
    if (score > 0) {
      scoredSwaps.push({ baseId: variant.replaces, variant, score })
    }
  }

  // Sort by score descending
  scoredSwaps.sort((a, b) => b.score - a.score)

  // Pick best variant per base question (no duplicates)
  const bestPerBase = new Map<string, QuestionVariant>()
  for (const swap of scoredSwaps) {
    if (!bestPerBase.has(swap.baseId)) {
      bestPerBase.set(swap.baseId, swap.variant)
    }
  }

  // Track which dimensions are covered by base questions
  const dimensionCoverage = new Map<string, number>()
  for (const q of baseQuestions) {
    dimensionCoverage.set(q.dimension, (dimensionCoverage.get(q.dimension) ?? 0) + 1)
  }

  // Sort swap candidates by score (re-derive from bestPerBase)
  const swapCandidates = Array.from(bestPerBase.entries())
    .map(([baseId, variant]) => ({
      baseId,
      variant,
      score: scoredSwaps.find((s) => s.baseId === baseId && s.variant.id === variant.id)!.score,
    }))
    .sort((a, b) => b.score - a.score)

  // Apply swaps up to the module limit
  const maxSwaps = MAX_SWAPS_PER_MODULE[moduleNum] ?? 3
  const swappedIds = new Set<string>()

  for (const candidate of swapCandidates) {
    if (swappedIds.size >= maxSwaps) break

    // Ensure we keep at least one base question per dimension
    const baseQ = baseQuestions.find((q) => q.id === candidate.baseId)
    if (!baseQ) continue

    const dimCount = dimensionCoverage.get(baseQ.dimension) ?? 0
    if (dimCount <= 1) {
      // This is the only base question in this dimension — don't swap
      // (the variant covers the same dimension, but we want at least one anchor)
      continue
    }

    swappedIds.add(candidate.baseId)
    dimensionCoverage.set(baseQ.dimension, dimCount - 1)
  }

  // Build final question set
  return baseQuestions.map((q) => {
    if (swappedIds.has(q.id)) {
      const variant = bestPerBase.get(q.id)!
      // Return the variant as a regular AssessmentQuestion (strip demographic metadata)
      return {
        id: variant.id,
        module: variant.module,
        quotient: variant.quotient,
        dimension: variant.dimension,
        text: variant.text,
        options: variant.options,
        format: variant.format,
        subtype: variant.subtype,
        reverseScored: variant.reverseScored,
        paid: variant.paid,
        price: variant.price,
      } as AssessmentQuestion
    }
    return q
  })
}

// ─── Utility: Get all available variants for a user ────

/**
 * Returns all variants across all modules that match a user's demographics,
 * useful for analytics or admin dashboards.
 */
export function getMatchingVariants(
  dateOfBirth?: string | null,
  culturalBackground?: string | null
): QuestionVariant[] {
  if (!dateOfBirth && !culturalBackground) return []

  const ageBracket: AgeBracket = dateOfBirth
    ? getAgeBracket(dateOfBirth)
    : 'established'

  const culturalContext: CulturalContext = getCulturalContext(culturalBackground)

  const { ALL_VARIANTS } = require('./question-variants')
  return (ALL_VARIANTS as QuestionVariant[]).filter(
    (v) => scoreVariant(v, ageBracket, culturalContext) > 0
  )
}
