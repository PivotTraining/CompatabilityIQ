'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Brain, Compass, MessageCircle, User, LogOut } from 'lucide-react'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/app/assessment', icon: Brain, label: 'Assess' },
  { href: '/app/discover', icon: Compass, label: 'Discover' },
  { href: '/app/matches', icon: MessageCircle, label: 'Matches' },
  { href: '/app/profile', icon: User, label: 'Profile' },
] as const

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!user) return null

  const isOnboarding = pathname === '/app/onboarding'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Top bar */}
      {!isOnboarding && (
        <header
          className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b backdrop-blur-xl"
          style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', opacity: 0.97 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--ciq-purple)' }}>
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              CompatibleIQ
            </span>
          </div>
          <button
            onClick={() => signOut().then(() => router.replace('/login'))}
            className="p-2 rounded-lg transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom nav */}
      {!isOnboarding && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 py-2 border-t backdrop-blur-xl"
          style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', opacity: 0.97 }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors"
              >
                <item.icon
                  className="w-5 h-5"
                  style={{ color: isActive ? 'var(--ciq-purple)' : 'var(--text-muted)' }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? 'var(--ciq-purple)' : 'var(--text-muted)' }}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}
