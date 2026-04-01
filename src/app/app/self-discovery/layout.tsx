import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Self-Discovery Dashboard',
  description:
    'Explore your psychometric profile across 6 science-backed dimensions. Understand your attachment style, communication patterns, emotional intelligence, and relationship blind spots — no dating required.',
  openGraph: {
    title: 'Self-Discovery Dashboard | CompatibleIQ',
    description:
      'Your personal compatibility profile. Discover your attachment style, communication patterns, and what makes you tick in relationships.',
    url: 'https://compatibleiq.com/app/self-discovery',
  },
}

export default function SelfDiscoveryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
