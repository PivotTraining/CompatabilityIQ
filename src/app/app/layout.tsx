'use client'

import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Brain, Compass, Heart, User, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

type UserMode = 'dating' | 'self_discovery'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getSupabaseBrowserClient()
  const [unreadCount, setUnreadCount] = useState(0)
  const [userMode, setUserMode] = useState<UserMode>('dating')

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  // Fetch user mode from profile
  useEffect(() => {
    if (!user || !supabase) return

    supabase
      .from('profiles')
      .select('mode')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const row = data as { mode?: string } | null
        if (row?.mode === 'self_discovery') {
          setUserMode('self_discovery')
        } else {
          setUserMode('dating')
        }
      })
  }, [user, supabase])

  // Fetch unread message count for Matches tab badge (dating mode only)
  useEffect(() => {
    if (!user || !supabase || userMode === 'self_discovery') return

    const fetchUnread = async () => {
      const { data: matchData } = await supabase
        .from('matches')
        .select('id')
        .eq('status', 'active')
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)

      const matchIds = (matchData ?? []).map((m: { id: string }) => m.id)
      if (!matchIds.length) {
        setUnreadCount(0)
        return
      }

      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .in('match_id', matchIds)
        .neq('sender_id', user.id)
        .is('read_at', null)

      setUnreadCount(count ?? 0)
    }

    fetchUnread()

    const channel = supabase
      .channel('layout-unread')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => fetchUnread()
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        () => fetchUnread()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase, userMode])

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (!user) return null

  const isOnboarding = pathname === '/app/onboarding'
  const isChatView = pathname.startsWith('/app/chat/')

  // Build nav items based on user mode
  const NAV_ITEMS = userMode === 'self_discovery'
    ? [
        { href: '/app/self-discovery', icon: User, label: 'My Profile' },
        { href: '/app/assessment', icon: Brain, label: 'Assess' },
        { href: '/app/profile', icon: User, label: 'Profile' },
        { href: '/app/profile/settings', icon: Settings, label: 'Settings' },
      ]
    : [
        { href: '/app/discover', icon: Compass, label: 'Discover' },
        { href: '/app/matches', icon: Heart, label: 'Matches' },
        { href: '/app/assessment', icon: Brain, label: 'Assess' },
        { href: '/app/profile', icon: User, label: 'Profile' },
        { href: '/app/profile/settings', icon: Settings, label: 'Settings' },
      ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Top bar (hidden on onboarding and chat) */}
      {!isOnboarding && !isChatView && (
        <header
          className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b backdrop-blur-xl"
          style={{
            background: 'var(--bg-primary)',
            borderColor: 'var(--border)',
            opacity: 0.97,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: 'var(--ciq-purple)' }}
            >
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              CompatibleIQ
            </span>
            {userMode === 'self_discovery' && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: '#E8F5E9', color: 'var(--ciq-green)' }}
              >
                Self-Discovery
              </span>
            )}
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
      <main className={`flex-1 ${!isChatView ? 'pb-20' : ''}`}>{children}</main>

      {/* Bottom nav (hidden on onboarding and chat) */}
      {!isOnboarding && !isChatView && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl safe-area-bottom"
          style={{
            background: 'var(--bg-primary)',
            borderColor: 'var(--border)',
            opacity: 0.97,
          }}
        >
          <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const isMatches = item.href === '/app/matches'

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors relative"
                >
                  <div className="relative">
                    <item.icon
                      className="w-5 h-5"
                      style={{
                        color: isActive ? 'var(--ciq-purple)' : 'var(--text-muted)',
                      }}
                    />
                    {isMatches && unreadCount > 0 && (
                      <span
                        className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: 'var(--ciq-coral)' }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: isActive ? 'var(--ciq-purple)' : 'var(--text-muted)',
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
