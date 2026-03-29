// @ts-nocheck -- pending schema regen
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { CIS_TIERS, getCISTier, type CISTierKey } from '@/lib/constants'
import { MessageCircle, Heart, Sparkles, ArrowUpDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// ── Types ──

interface MatchWithProfile {
  id: string
  cis_score: number | null
  status: string
  matched_at: string
  partner: {
    id: string
    first_name: string
    location_city: string | null
    date_of_birth: string | null
    photo_urls: string[] | null
  }
  last_message?: {
    content: string
    created_at: string
    sender_id: string
  }
  unread_count: number
}

type SortMode = 'recent' | 'score'

// ── Main Page ──

export default function MatchesPage() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const [matches, setMatches] = useState<MatchWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [sortMode, setSortMode] = useState<SortMode>('recent')

  useEffect(() => {
    if (!user || !supabase) return
    loadMatches()

    // Subscribe to new matches
    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
        },
        () => {
          loadMatches()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          loadMatches()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const loadMatches = async () => {
    if (!user || !supabase) return

    const { data: matchData } = await supabase
      .from('matches')
      .select('id, cis_score, status, matched_at, user_a_id, user_b_id')
      .eq('status', 'active')
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .order('matched_at', { ascending: false })

    type MatchRow = {
      id: string
      cis_score: number | null
      status: string
      matched_at: string
      user_a_id: string
      user_b_id: string
    }
    const matchRows = (matchData ?? []) as unknown as MatchRow[]

    if (!matchRows.length) {
      setMatches([])
      setLoading(false)
      return
    }

    // Get partner profiles
    const partnerIds = matchRows.map((m) =>
      m.user_a_id === user.id ? m.user_b_id : m.user_a_id
    )

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, first_name, location_city, date_of_birth, photo_urls')
      .in('id', partnerIds)

    type ProfileRow = {
      id: string
      first_name: string
      location_city: string | null
      date_of_birth: string | null
      photo_urls: string[] | null
    }
    const typedProfiles = (profileData ?? []) as unknown as ProfileRow[]
    const profileMap = new Map(typedProfiles.map((p) => [p.id, p]))

    // Get last messages for each match
    const matchIds = matchRows.map((m) => m.id)
    const { data: messageData } = await supabase
      .from('messages')
      .select('match_id, content, created_at, sender_id')
      .in('match_id', matchIds)
      .order('created_at', { ascending: false })

    type MsgRow = {
      match_id: string
      content: string
      created_at: string
      sender_id: string
    }
    const typedMessages = (messageData ?? []) as unknown as MsgRow[]
    const lastMessageMap = new Map<string, MsgRow>()
    typedMessages.forEach((msg) => {
      if (!lastMessageMap.has(msg.match_id)) {
        lastMessageMap.set(msg.match_id, msg)
      }
    })

    // Get unread counts
    const { data: unreadData } = await supabase
      .from('messages')
      .select('match_id')
      .in('match_id', matchIds)
      .neq('sender_id', user.id)
      .is('read_at', null)

    const unreadRows = (unreadData ?? []) as unknown as { match_id: string }[]
    const unreadMap = new Map<string, number>()
    unreadRows.forEach((r) => {
      unreadMap.set(r.match_id, (unreadMap.get(r.match_id) ?? 0) + 1)
    })

    const enriched: MatchWithProfile[] = matchRows
      .map((m) => {
        const partnerId = m.user_a_id === user.id ? m.user_b_id : m.user_a_id
        const partner = profileMap.get(partnerId)
        if (!partner) return null
        return {
          id: m.id,
          cis_score: m.cis_score,
          status: m.status,
          matched_at: m.matched_at,
          partner,
          last_message: lastMessageMap.get(m.id) ?? undefined,
          unread_count: unreadMap.get(m.id) ?? 0,
        }
      })
      .filter(Boolean) as MatchWithProfile[]

    setMatches(enriched)
    setLoading(false)
  }

  // Sort matches
  const sortedMatches = [...matches].sort((a, b) => {
    if (sortMode === 'score') {
      return (b.cis_score ?? 0) - (a.cis_score ?? 0)
    }
    // recent: sort by last message time, then match time
    const aTime = a.last_message?.created_at ?? a.matched_at
    const bTime = b.last_message?.created_at ?? b.matched_at
    return new Date(bTime).getTime() - new Date(aTime).getTime()
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Resonances
        </h1>
        {matches.length > 1 && (
          <button
            onClick={() => setSortMode((m) => (m === 'recent' ? 'score' : 'recent'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortMode === 'recent' ? 'Most Recent' : 'Highest Score'}
          </button>
        )}
      </div>

      {/* Empty state */}
      {matches.length === 0 ? (
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}
          >
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No Resonances yet
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Complete your assessments and start connecting! When someone you connect with connects
            back, your Resonance will appear here.
          </p>
          <Link
            href="/app/discover"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--ciq-purple)' }}
          >
            Start Discovering
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedMatches.map((match) => {
            const tier = match.cis_score !== null ? getCISTier(match.cis_score) : null
            const tierInfo = tier ? CIS_TIERS[tier] : null
            const timeAgo = getTimeAgo(match.last_message?.created_at ?? match.matched_at)
            const photoUrl = match.partner.photo_urls?.[0] ?? null
            const hasUnread = match.unread_count > 0

            return (
              <Link key={match.id} href={`/app/chat/${match.id}`}>
                <div
                  className="flex items-center gap-3 p-3 rounded-2xl border transition-all hover:shadow-sm"
                  style={{
                    background: hasUnread ? 'var(--ciq-purple-light)' : 'var(--bg-card)',
                    borderColor: hasUnread ? 'var(--ciq-purple)' : 'var(--border)',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center relative"
                    style={{ background: tierInfo?.bg ?? 'var(--bg-secondary)' }}
                  >
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={match.partner.first_name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <span
                        className="text-lg font-bold"
                        style={{ color: tierInfo?.color ?? 'var(--text-muted)' }}
                      >
                        {match.partner.first_name?.[0]?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3
                        className="text-sm truncate"
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: hasUnread ? 700 : 600,
                        }}
                      >
                        {match.partner.first_name}
                      </h3>
                      {tierInfo && match.cis_score !== null && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background:
                              tier === 'rare'
                                ? 'linear-gradient(135deg, #D4AF37, #9333EA)'
                                : tierInfo.bg,
                            color: tier === 'rare' ? '#fff' : tierInfo.color,
                          }}
                        >
                          {Math.round(match.cis_score)}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs truncate"
                      style={{
                        color: hasUnread ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: hasUnread ? 500 : 400,
                      }}
                    >
                      {match.last_message
                        ? match.last_message.sender_id === user?.id
                          ? `You: ${match.last_message.content}`
                          : match.last_message.content
                        : 'New Resonance \u2014 say hello!'}
                    </p>
                  </div>

                  {/* Right side: time + unread */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {timeAgo}
                    </span>
                    {hasUnread && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: 'var(--ciq-purple)' }}
                      >
                        {match.unread_count > 9 ? '9+' : match.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Helpers ──

function getTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
