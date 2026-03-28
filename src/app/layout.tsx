import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CompatibleIQ — Know Before You Fall',
  description: 'Real compatibility isn\'t a vibe check. 19 validated dimensions — psychology, finances, and behavior — scored before you ever match.',
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
