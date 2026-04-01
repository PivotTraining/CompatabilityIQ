'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { ArrowLeft, Send, Shield, Flag, Lightbulb } from 'lucide-react'
import { LIMITS } from '@/lib/constants'
import { filterMessage } from '@/lib/messaging/content-filter'
import ConversationStarters from '@/components/chat/ConversationStarters'
import ResonanceReportUpsell from '@/components/chat/ResonanceReportUpsell'
import CompatibilityInsights from '@/components/chat/CompatibilityInsights'
import { generateConversationStarters } from '@/lib/matching/conversation-starters'
import type { ConversationStarter } from '@/lib/matching/conversation-starters'

interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

interface PartnerInfo {
  first_name: string
  location_city: string | null
}

interface DimensionScoreRow {
  dimension_id: string
  overall_score: number
}

export default function ChatPage() {
  const params = useParams()
  const matchId = params.matchId as string
  const router = useRouter()
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()

  const [messages, setMessages] = useState<Message[]>([])
  const [partner, setPartner] = useState<PartnerInfo | null>(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [starters, setStarters] = useState<ConversationStarter[]>([])
  const [insightsOpen, setInsightsOpen] = useState(false)
  const [cisScore, setCisScore] = useState<number | null>(null)
  const [userDimensionScores, setUserDimensionScores] = useState<Record<string, number>>({})
  const [partnerDimensionScores, setPartnerDimensionScores] = useState<Record<string, number>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user || !matchId || !supabase) return

    // Load match info and partner
    const loadMatch = async () => {
      const { data: matchRaw } = await supabase
        .from('matches')
        .select('id, user_a_id, user_b_id, status, cis_score')
        .eq('id', matchId)
        .single()

      const match = matchRaw as { id: string; user_a_id: string; user_b_id: string; status: string; cis_score: number | null } | null
      if (!match || match.status !== 'active') {
        router.replace('/app/matches')
        return
      }

      const partnerId = match.user_a_id === user.id ? match.user_b_id : match.user_a_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, location_city')
        .eq('id', partnerId)
        .single()

      setPartner(profile as unknown as PartnerInfo)

      // Load dimension scores for conversation starters
      const [userScoresResult, partnerScoresResult] = await Promise.all([
        supabase
          .from('dimension_scores')
          .select('dimension_id, overall_score')
          .eq('user_id', user.id),
        supabase
          .from('dimension_scores')
          .select('dimension_id, overall_score')
          .eq('user_id', partnerId),
      ])

      const toScoreMap = (rows: DimensionScoreRow[]): Record<string, number> =>
        rows.reduce<Record<string, number>>((acc, row) => ({
          ...acc,
          [row.dimension_id]: row.overall_score,
        }), {})

      const userScores = toScoreMap(
        (userScoresResult.data ?? []) as unknown as DimensionScoreRow[],
      )
      const partnerScores = toScoreMap(
        (partnerScoresResult.data ?? []) as unknown as DimensionScoreRow[],
      )

      setCisScore(match.cis_score ?? null)
      setUserDimensionScores(userScores)
      setPartnerDimensionScores(partnerScores)

      const partnerName = (profile as unknown as PartnerInfo)?.first_name ?? 'them'
      const generatedStarters = generateConversationStarters(
        userScores,
        partnerScores,
        'You',
        partnerName,
      )
      setStarters(generatedStarters)

      // Load messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })

      const typedMsgs = (msgs ?? []) as unknown as Message[]
      setMessages(typedMsgs)
      setLoading(false)

      // Mark unread messages as read
      if (typedMsgs.length) {
        const unread = typedMsgs.filter((m) => !m.is_read && m.sender_id !== user.id)
        if (unread.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true } as never)
            .in('id', unread.map((m) => m.id))
        }
      }
    }

    loadMatch()

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      }, (payload) => {
        const newMsg = payload.new as Message
        setMessages((prev) => [...prev, newMsg])
        // Mark as read if from partner
        if (newMsg.sender_id !== user.id) {
          supabase.from('messages').update({ is_read: true } as never).eq('id', newMsg.id)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, matchId, supabase, router])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!user || !supabase || !input.trim() || sending) return
    const content = input.trim()
    if (content.length > LIMITS.maxMessageLength) return

    const filtered = filterMessage(content)

    setSending(true)
    setInput('')

    const { error } = await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: user.id,
      content: filtered.clean,
    } as never)

    setSending(false)
    if (error) {
      setInput(content) // Restore on failure
    }
  }

  const handleBlock = async () => {
    if (!user || !supabase || !partner) return
    // Get partner ID from match
    const { data: matchRaw2 } = await supabase
      .from('matches')
      .select('user_a_id, user_b_id')
      .eq('id', matchId)
      .single()

    const matchData = matchRaw2 as { user_a_id: string; user_b_id: string } | null
    if (!matchData) return
    const partnerId = matchData.user_a_id === user.id ? matchData.user_b_id : matchData.user_a_id

    await supabase.from('blocks').insert({
      blocker_id: user.id,
      blocked_id: partnerId,
    } as never)

    router.replace('/app/matches')
  }

  if (loading || !partner) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-120px)]">
    <div className="flex flex-col flex-1 min-w-0">
      {/* Chat header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          onClick={() => router.push('/app/matches')}
          className="p-1.5 -ml-1 rounded-lg"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {partner.first_name}
          </h2>
          {partner.location_city && (
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {partner.location_city}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setInsightsOpen((prev) => !prev)}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: insightsOpen ? 'var(--ciq-purple)' : 'var(--text-muted)',
              background: insightsOpen ? '#F3E8FF' : 'transparent',
            }}
            title="Compatibility insights"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <button
            onClick={handleBlock}
            className="p-2 rounded-lg"
            style={{ color: 'var(--text-muted)' }}
            title="Block user"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="py-4">
            <p className="text-sm text-center mb-2" style={{ color: 'var(--text-muted)' }}>
              You matched! Say hello.
            </p>
            <ConversationStarters
              starters={starters}
              onSelect={(text) => setInput(text)}
            />
          </div>
        )}
        {messages.map((msg, index) => {
          const isMine = msg.sender_id === user?.id
          return (
            <div key={msg.id}>
              <div
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                  style={{
                    background: isMine ? 'var(--ciq-purple)' : 'var(--bg-secondary)',
                    color: isMine ? 'white' : 'var(--text-primary)',
                    borderBottomRightRadius: isMine ? '4px' : undefined,
                    borderBottomLeftRadius: !isMine ? '4px' : undefined,
                  }}
                >
                  {msg.content}
                </div>
              </div>
              {/* Show upsell card after the 3rd message */}
              {index === 2 && (
                <ResonanceReportUpsell
                  matchId={matchId}
                  messageCount={messages.length}
                  partnerName={partner?.first_name ?? 'your match'}
                />
              )}
            </div>
          )
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          maxLength={LIMITS.maxMessageLength}
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
          style={{ background: 'var(--ciq-purple)' }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>

      {/* Compatibility Insights Panel */}
      <CompatibilityInsights
        isOpen={insightsOpen}
        onClose={() => setInsightsOpen(false)}
        cisScore={cisScore}
        userScores={userDimensionScores}
        partnerScores={partnerDimensionScores}
        partnerName={partner?.first_name ?? 'your match'}
      />
    </div>
  )
}
