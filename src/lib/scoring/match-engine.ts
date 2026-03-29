// CompatibleIQ -- Match Engine
// Finds potential matches (Resonances) for a user by computing CIS against all eligible candidates.

import { getSupabaseServiceClient } from '../supabase/server'
import { computeDimensionScores, computeCIS } from './cis-engine'
import { MATCH_THRESHOLD } from './constants'
import type { DimensionId, DimensionScore, MatchCandidate } from './types'
import type { GenderIdentity, InterestedIn } from '../supabase/types'

// ═══════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════

/** All 6 dimension IDs in scoring order */
const ALL_DIMENSIONS: DimensionId[] = [
  'values',
  'attachment',
  'communication',
  'emotional_intelligence',
  'lifestyle_ambition',
  'love_languages',
]

/**
 * Maps the assessment_responses.dimension_id values (which may differ from our scoring DimensionId)
 * to the scoring engine's DimensionId. The DB stores 'lifestyle' but the scoring engine uses 'lifestyle_ambition'.
 */
const DB_TO_SCORING_DIMENSION: Record<string, DimensionId> = {
  values: 'values',
  attachment: 'attachment',
  communication: 'communication',
  emotional_intelligence: 'emotional_intelligence',
  lifestyle: 'lifestyle_ambition',
  love_languages: 'love_languages',
}

// ═══════════════════════════════════════════
// Match Engine
// ═══════════════════════════════════════════

/**
 * Find all compatible users (Resonances) for the given user.
 *
 * Pipeline:
 * 1. Load the requesting user's profile and assessment responses
 * 2. Compute the requesting user's dimension scores
 * 3. Query all eligible candidates (completed assessments, not blocked, not already matched)
 * 4. Filter by gender/orientation preferences
 * 5. Compute CIS for each candidate pair
 * 6. Return candidates above the threshold, sorted by score descending
 *
 * @param userId - The requesting user's UUID
 * @param minScore - Minimum CIS to include (defaults to MATCH_THRESHOLD = 60)
 * @returns Array of MatchCandidate sorted by CIS descending
 */
export async function findResonances(
  userId: string,
  minScore: number = MATCH_THRESHOLD
): Promise<MatchCandidate[]> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) {
    throw new Error('Supabase client not configured')
  }

  // ── Step 1: Load requesting user's profile ──
  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError || !userProfile) {
    throw new Error(`Failed to load profile for user ${userId}: ${profileError?.message}`)
  }

  if (!userProfile.assessment_completed) {
    throw new Error('User has not completed all assessments')
  }

  // ── Step 2: Load requesting user's assessment responses ──
  const { data: userResponses, error: responsesError } = await supabase
    .from('assessment_responses')
    .select('dimension_id, answers')
    .eq('user_id', userId)

  if (responsesError || !userResponses) {
    throw new Error(`Failed to load assessment responses: ${responsesError?.message}`)
  }

  // Compute dimension scores for the requesting user
  const userScores = computeUserScores(userResponses)
  if (userScores.length < ALL_DIMENSIONS.length) {
    throw new Error('User is missing assessment responses for one or more dimensions')
  }

  // ── Step 3: Get blocked user IDs ──
  const { data: blocks } = await supabase
    .from('blocks')
    .select('blocked_id, blocker_id')
    .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`)

  const blockedUserIds = new Set<string>()
  if (blocks) {
    for (const block of blocks) {
      // Exclude users in either direction of the block
      if (block.blocker_id === userId) blockedUserIds.add(block.blocked_id)
      if (block.blocked_id === userId) blockedUserIds.add(block.blocker_id)
    }
  }

  // ── Step 4: Get existing match user IDs ──
  const { data: existingMatches } = await supabase
    .from('matches')
    .select('user_a_id, user_b_id')
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)

  const existingMatchUserIds = new Set<string>()
  if (existingMatches) {
    for (const match of existingMatches) {
      if (match.user_a_id === userId) existingMatchUserIds.add(match.user_b_id)
      if (match.user_b_id === userId) existingMatchUserIds.add(match.user_a_id)
    }
  }

  // ── Step 5: Query eligible candidate profiles ──
  // Candidates must have completed all assessments
  let candidateQuery = supabase
    .from('profiles')
    .select('id, first_name, bio, photo_urls, location_city, location_state, gender_identity, interested_in, date_of_birth')
    .eq('assessment_completed', true)
    .neq('id', userId)

  const { data: candidateProfiles, error: candidateError } = await candidateQuery

  if (candidateError) {
    throw new Error(`Failed to query candidate profiles: ${candidateError.message}`)
  }

  if (!candidateProfiles || candidateProfiles.length === 0) {
    return []
  }

  // ── Step 6: Filter candidates ──
  const eligibleCandidates = candidateProfiles.filter((candidate) => {
    // Exclude blocked users
    if (blockedUserIds.has(candidate.id)) return false

    // Exclude existing matches
    if (existingMatchUserIds.has(candidate.id)) return false

    // Check gender/orientation preference compatibility
    if (!isPreferenceCompatible(userProfile, candidate)) return false

    return true
  })

  if (eligibleCandidates.length === 0) {
    return []
  }

  // ── Step 7: Load assessment responses for all eligible candidates ──
  const candidateIds = eligibleCandidates.map((c) => c.id)
  const { data: allCandidateResponses, error: candidateResponsesError } = await supabase
    .from('assessment_responses')
    .select('user_id, dimension_id, answers')
    .in('user_id', candidateIds)

  if (candidateResponsesError || !allCandidateResponses) {
    throw new Error(`Failed to load candidate responses: ${candidateResponsesError?.message}`)
  }

  // Group responses by user_id
  const responsesByUser = new Map<string, { dimension_id: string; answers: Record<string, unknown> }[]>()
  for (const response of allCandidateResponses) {
    if (!responsesByUser.has(response.user_id)) {
      responsesByUser.set(response.user_id, [])
    }
    responsesByUser.get(response.user_id)!.push(response)
  }

  // ── Step 8: Compute CIS for each candidate ──
  const matchCandidates: MatchCandidate[] = []

  for (const candidate of eligibleCandidates) {
    const candidateResponses = responsesByUser.get(candidate.id)
    if (!candidateResponses || candidateResponses.length < ALL_DIMENSIONS.length) {
      continue // Skip candidates with incomplete assessments
    }

    const candidateScores = computeUserScores(candidateResponses)
    if (candidateScores.length < ALL_DIMENSIONS.length) {
      continue
    }

    const cisResult = computeCIS(userScores, candidateScores)

    // Only include candidates above the minimum score threshold
    if (cisResult.overallScore >= minScore) {
      matchCandidates.push({
        userId: candidate.id,
        firstName: candidate.first_name,
        bio: candidate.bio,
        photoUrls: candidate.photo_urls,
        locationCity: candidate.location_city,
        locationState: candidate.location_state,
        genderIdentity: candidate.gender_identity,
        dateOfBirth: candidate.date_of_birth,
        cisResult,
      })
    }
  }

  // ── Step 9: Sort by CIS score descending ──
  matchCandidates.sort((a, b) => b.cisResult.overallScore - a.cisResult.overallScore)

  return matchCandidates
}

// ═══════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════

/**
 * Compute dimension scores from a user's raw assessment responses.
 */
function computeUserScores(
  responses: { dimension_id: string; answers: Record<string, unknown> }[]
): DimensionScore[] {
  const scores: DimensionScore[] = []

  for (const response of responses) {
    const scoringDimensionId = DB_TO_SCORING_DIMENSION[response.dimension_id]
    if (!scoringDimensionId) continue

    // Cast answers to the expected type (Supabase stores as Record<string, unknown>)
    const answers = response.answers as Record<string, number | string>

    const dimensionScore = computeDimensionScores(scoringDimensionId, answers)
    scores.push(dimensionScore)
  }

  return scores
}

/**
 * Check if two users' gender/orientation preferences are mutually compatible.
 *
 * Rules:
 * - User A's interested_in must include User B's gender_identity
 * - User B's interested_in must include User A's gender_identity
 * - "everyone" matches any gender identity
 * - "self_describe" for interested_in is treated as "everyone" (inclusive default)
 */
function isPreferenceCompatible(
  userA: { gender_identity: GenderIdentity | null; interested_in: InterestedIn | null },
  userB: { gender_identity: GenderIdentity | null; interested_in: InterestedIn | null }
): boolean {
  // If either user hasn't set preferences, skip filtering (be inclusive)
  if (!userA.interested_in || !userA.gender_identity) return true
  if (!userB.interested_in || !userB.gender_identity) return true

  const aInterestedInB = doesPreferenceMatch(userA.interested_in, userB.gender_identity)
  const bInterestedInA = doesPreferenceMatch(userB.interested_in, userA.gender_identity)

  return aInterestedInB && bInterestedInA
}

/**
 * Check if an interested_in preference matches a gender identity.
 */
function doesPreferenceMatch(
  interestedIn: InterestedIn,
  genderIdentity: GenderIdentity
): boolean {
  if (interestedIn === 'everyone' || interestedIn === 'self_describe') return true

  switch (interestedIn) {
    case 'women':
      return genderIdentity === 'woman'
    case 'men':
      return genderIdentity === 'man'
    default:
      return true
  }
}
