import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log In',
  description:
    'Sign in to CompatibleIQ to view your compatibility scores, chat with your Resonances, and continue your assessment.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
