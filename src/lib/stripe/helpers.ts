// @ts-nocheck — Types will be regenerated after Supabase migration
// CompatibleIQ™ — Stripe Helper Functions
// Utility functions for checking subscriptions, reports, and founding member status

import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { FOUNDING_MEMBER_LIMIT } from './config'

/**
 * Check if a user has an active paid subscription (pro or founding_member).
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return false

  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single()

  if (error || !data) return false
  return data.subscription_tier === 'pro' || data.subscription_tier === 'founding_member'
}

/**
 * Check if a user has already purchased a Resonance Report for a specific match.
 */
export async function hasResonanceReport(userId: string, matchId: string): Promise<boolean> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return false

  const { data, error } = await supabase
    .from('resonance_reports')
    .select('id')
    .eq('purchased_by', userId)
    .eq('match_id', matchId)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[stripe/helpers] Error checking resonance report:', error)
    return false
  }

  return !!data
}

/**
 * Get the current number of founding member subscriptions.
 */
export async function getFoundingMemberCount(): Promise<number> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('subscription_tier', 'founding_member')

  if (error) {
    console.error('[stripe/helpers] Error counting founding members:', error)
    return 0
  }

  return count ?? 0
}

/**
 * Check if founding member slots are still available.
 */
export async function isFoundingMemberAvailable(): Promise<boolean> {
  const count = await getFoundingMemberCount()
  return count < FOUNDING_MEMBER_LIMIT
}

/**
 * Get the user's current subscription tier.
 */
export async function getUserSubscriptionTier(
  userId: string
): Promise<'free' | 'pro' | 'founding_member'> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return 'free'

  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single()

  if (error || !data) return 'free'
  return data.subscription_tier
}
