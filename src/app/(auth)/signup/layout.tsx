import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create your free CompatibleIQ account and take a psychometric compatibility assessment across 15 science-backed dimensions.',
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
