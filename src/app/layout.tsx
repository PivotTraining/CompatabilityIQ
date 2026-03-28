import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CompatibleIQ — Date with Proof',
  description: '15 science-backed dimensions. One compatibility score. Zero wasted time. The psychometric dating platform for people who are done guessing.',
  robots: 'noindex, nofollow',
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
