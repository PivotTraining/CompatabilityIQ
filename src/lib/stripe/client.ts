// CompatibleIQ™ — Server-side Stripe Client
// Only import this in server-side code (API routes, server actions)

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
  appInfo: {
    name: 'CompatibleIQ',
    version: '0.1.0',
  },
})
