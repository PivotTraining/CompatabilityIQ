// CompatibleIQ™ — Server-side Stripe Client
// Only import this in server-side code (API routes, server actions)

import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (_stripe) return _stripe

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
  }

  _stripe = new Stripe(key, {
    typescript: true,
    appInfo: {
      name: 'CompatibleIQ',
      version: '0.1.0',
    },
  })

  return _stripe
}

// Legacy export for backward compatibility — lazy initialized
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as Record<string | symbol, unknown>)[prop]
  },
})
