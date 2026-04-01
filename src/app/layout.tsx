import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'CompatibleIQ — Science-Based Compatibility Assessment',
    template: '%s | CompatibleIQ',
  },
  description:
    'The psychometric dating platform that scores real compatibility across 6 science-backed dimensions before your first date. Free assessments, real results — stop guessing and start knowing.',
  keywords: [
    'compatibility',
    'dating app',
    'psychometric',
    'compatibility score',
    'science-backed dating',
    'relationship compatibility',
    'personality assessment',
    'compatibility test',
    'CompatibleIQ',
    'CIS score',
  ],
  robots: { index: true, follow: true },
  metadataBase: new URL('https://compatibleiq.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'CompatibleIQ',
    title: 'CompatibleIQ — Science-Based Compatibility Assessment',
    description:
      '6 science-backed dimensions. One compatibility score. Zero wasted time. The psychometric dating platform for people who are done guessing.',
    url: 'https://compatibleiq.com',
    images: [
      {
        url: 'https://compatibleiq.com/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CompatibleIQ — Science-backed compatibility scoring for modern dating',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CompatibleIQ — Science-Based Compatibility Assessment',
    description:
      '6 science-backed dimensions. One compatibility score. Zero wasted time.',
    images: ['https://compatibleiq.com/images/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
