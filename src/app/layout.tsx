import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import CookieConsent from '@/components/CookieConsent'
import './globals.css'

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: {
    default: 'CompatibleIQ — Serious Dating, Backed by Science',
    template: '%s | CompatibleIQ',
  },
  description:
    'The serious dating app that scores real compatibility across 6 science-backed dimensions before your first date. For singles looking for a real relationship — not hookups. Free assessments, real results.',
  keywords: [
    'serious dating',
    'dating app',
    'relationship compatibility',
    'find your match',
    'compatibility score',
    'science-backed dating',
    'psychometric',
    'personality assessment',
    'compatibility test',
    'long-term relationship',
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
    title: 'CompatibleIQ — Serious Dating, Backed by Science',
    description:
      'The serious dating app for singles who want a real relationship. 6 science-backed dimensions. One compatibility score. Zero wasted time.',
    url: 'https://compatibleiq.com',
    images: [
      {
        url: 'https://compatibleiq.com/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CompatibleIQ — Serious dating, backed by science',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CompatibleIQ — Serious Dating, Backed by Science',
    description:
      'For singles who want a real relationship. 6 science-backed dimensions. One compatibility score.',
    images: ['https://compatibleiq.com/images/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  )
}
