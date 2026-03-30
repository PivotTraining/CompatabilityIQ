// CompatibleIQ™ — Stripe Configuration
// Live-mode price IDs and product metadata

export const STRIPE_PRICES = {
  RESONANCE_REPORT: 'price_1TFz8fERWdPcDJ1ZZlktRAcW',
  SELF_DISCOVERY_REPORT: 'price_1TGmtzERWdPcDJ1ZXcr1aMvq',
  CIQ_PRO: 'price_1TFz8fERWdPcDJ1ZjdDRaLoh',
  FOUNDING_MEMBER: 'price_1TFz8gERWdPcDJ1Z9rTrxv3P',
} as const

export type StripePriceId = (typeof STRIPE_PRICES)[keyof typeof STRIPE_PRICES]

/** Maximum number of Founding Member subscriptions */
export const FOUNDING_MEMBER_LIMIT = 1000

/** Map price IDs to product types for database storage */
export const PRICE_TO_PRODUCT_TYPE: Record<StripePriceId, 'resonance_report' | 'self_discovery_report' | 'ciq_pro' | 'founding_member'> = {
  [STRIPE_PRICES.RESONANCE_REPORT]: 'resonance_report',
  [STRIPE_PRICES.SELF_DISCOVERY_REPORT]: 'self_discovery_report',
  [STRIPE_PRICES.CIQ_PRO]: 'ciq_pro',
  [STRIPE_PRICES.FOUNDING_MEMBER]: 'founding_member',
}

/** Map price IDs to subscription tiers */
export const PRICE_TO_TIER: Partial<Record<StripePriceId, 'pro' | 'founding_member'>> = {
  [STRIPE_PRICES.CIQ_PRO]: 'pro',
  [STRIPE_PRICES.FOUNDING_MEMBER]: 'founding_member',
}

/** Map price IDs to amount in cents */
export const PRICE_AMOUNTS: Record<StripePriceId, number> = {
  [STRIPE_PRICES.RESONANCE_REPORT]: 499,
  [STRIPE_PRICES.SELF_DISCOVERY_REPORT]: 499,
  [STRIPE_PRICES.CIQ_PRO]: 1499,
  [STRIPE_PRICES.FOUNDING_MEMBER]: 999,
}

/** Subscription price IDs */
export const SUBSCRIPTION_PRICES = new Set<StripePriceId>([
  STRIPE_PRICES.CIQ_PRO,
  STRIPE_PRICES.FOUNDING_MEMBER,
])

/** Check if a price ID is a valid CompatibleIQ price */
export function isValidPriceId(priceId: string): priceId is StripePriceId {
  return Object.values(STRIPE_PRICES).includes(priceId as StripePriceId)
}
