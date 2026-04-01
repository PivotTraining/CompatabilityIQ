import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Profile',
  description:
    'Manage your CompatibleIQ profile, view your CIS score, and customize how potential matches see you. Your psychometric profile powers smarter, science-backed connections.',
  openGraph: {
    title: 'Your Profile | CompatibleIQ',
    description:
      'Your CompatibleIQ profile and CIS compatibility score. Manage your assessment results and dating preferences.',
    url: 'https://compatibleiq.com/app/profile',
  },
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
