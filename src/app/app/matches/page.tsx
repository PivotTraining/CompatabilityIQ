'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { CIS_TIERS, type CISTierKey } from '@/lib/constants'
import { MessageCircle, Heart } from 'lucide-react'
import Link from 'next/link'

interface MatchWithProfile {
  id: string
  match_tier: CISTierKey | null
  created_at: string
  partner: {
    id: string
    display_name: string
    location_city: string | null
    date_of_birth: string
  }
  last_message?: {
    content: string
    created_at: string
    sender_id: string
  }
}

export default function MatchesPage() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const [matches, setMatches] = useState<MatchWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadMatches()

    // Subscribe to new matches
    const channel = supabase
      .channel('matches-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'matches',
      }, () => {
        loadMatches()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  const loadMatches = async () => {
    if (!user) return

    const { data: matchData } = await supabase
      .from('matches')
      .select('id, match_tier, created_at, user_a_id, user_b_id')
      .eq('is_active', true)
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    const matchRows = (matchData ?? []) as unknown as { id: string; match_tier: string | null; created_at: string; user_a_id: string; user_b_id: string }[]

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
      .select('id, display_name, location_city, date_of_birth')
      .in('id', partnerIds)

    type ProfileRow = { id: string; display_name: string; location_city: string | null; date_of_birth: string }
    const typedProfiles = (profileData ?? []) as unknown as ProfileRow[]
    const profileMap = new Map(typedProfiles.map((p) => [p.id, p]))

    // Get last messages for each match
    const matchIds = matchRows.map((m) => m.id)
    const { data: messageData } = await supabase
      .from('messages')
      .select('match_id, content, created_at, sender_id')
      .in('match_id', matchIds)
      .order('created_at', { ascending: false })

    type MsgRow = { match_id: string; content: string; created_at: string; sender_id: string }
    const typedMessages = (messageData ?? []) as unknown as MsgRow[]
    const lastMessageMap = new Map<string, MsgRow>()
    typedMessages.forEach((msg) => {
      if (!lastMessageMap.has(msg.match_id)) {
        lastMessageMap.set(msg.match_id, msg)
      }
    })

    const enriched: MatchWithProfile[] = matchRows
      .map((m) => {
        const partnerId = m.user_a_id === user.id ? m.user_b_id : m.user_a_id
        const partner = profileMap.get(partnerId)
        if (!partner) return null
        return {
          id: m.id,
          match_tier: m.match_tier as CISTierKey | null,
          created_at: m.created_at,
          partner,
          last_message: lastMessageMap.get(m.id) ?? undefined,
        }
      })
      .filter(Boolean) as MatchWithProfile[]

    setMatches(enriched)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Matches
      </h1>

      {matches.length === 0 ? (
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
          >
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No matches yet
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            When someone you connect with connects back, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => {
            const tier = match.match_tier ? CIS_TIERS[match.match_tier] : null
            const timeAgo = getTimeAgo(match.last_message?.created_at ?? match.created_at)

            return (
              <Link key={match.id} href={`/app/chat/${match.id}`}>
                <div
                  className="flex items-center gap-3 p-3 rounded-2xl border transition-all hover:shadow-sm"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: tier?.bg ?? 'var(--bg-secondary)' }}
                  >
                    <span className="text-base font-bold" style={{ color: tier?.color ?? 'var(--text-muted)' }}>
                      {match.partner.display_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {match.partner.display_name}
                      </h3>
                      {tier && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: tier.bg, color: tier.color }}
                        >
                          {tier.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {match.last_message
                        ? match.last_message.content
                        : 'New match — say hello!'}
                    </p>
                  </div>

                  {/* Time */}
                  <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {timeAgo}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
