// CompatibleIQ -- Internal Messaging Service
// Text + emoji only chat between matched users (Resonances)

import { getSupabaseBrowserClient } from '../supabase/client'
import type { Message, ContentType } from '../supabase/types'
import { filterMessage } from './content-filter'

const MAX_MESSAGE_LENGTH = 2000
const DEFAULT_PAGE_SIZE = 50

// ─────────────────────────────────────────────
// Send a message in a match conversation
// ─────────────────────────────────────────────

export async function sendMessage(
  matchId: string,
  content: string
): Promise<Message | null> {
  const supabase = getSupabaseBrowserClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Enforce character limit
  if (content.length === 0 || content.length > MAX_MESSAGE_LENGTH) return null

  // Run content filter -- redact PII before storing
  const filtered = filterMessage(content)
  const cleanContent = filtered.clean

  // Determine content type: pure emoji or text
  const contentType: ContentType = isEmojiOnly(cleanContent) ? 'emoji' : 'text'

  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: user.id,
      content: cleanContent,
      content_type: contentType,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to send message:', error.message)
    return null
  }

  return data
}

// ─────────────────────────────────────────────
// Get messages for a match, paginated
// ─────────────────────────────────────────────

export async function getMessages(
  matchId: string,
  limit: number = DEFAULT_PAGE_SIZE,
  before?: string
): Promise<Message[]> {
  const supabase = getSupabaseBrowserClient()

  let query = supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (before) {
    query = query.lt('created_at', before)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch messages:', error.message)
    return []
  }

  // Return in chronological order (oldest first)
  return (data ?? []).reverse()
}

// ─────────────────────────────────────────────
// Mark messages as read
// ─────────────────────────────────────────────

export async function markAsRead(matchId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .neq('sender_id', user.id)
    .is('read_at', null)

  if (error) {
    console.error('Failed to mark messages as read:', error.message)
  }
}

// ─────────────────────────────────────────────
// Get unread message count for a user
// ─────────────────────────────────────────────

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = getSupabaseBrowserClient()

  // Get all active matches for the user
  const { data: matches, error: matchError } = await supabase
    .from('matches')
    .select('id')
    .eq('status', 'active')
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)

  if (matchError || !matches || matches.length === 0) return 0

  const matchIds = matches.map((m) => m.id)

  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .in('match_id', matchIds)
    .neq('sender_id', userId)
    .is('read_at', null)

  if (error) {
    console.error('Failed to get unread count:', error.message)
    return 0
  }

  return count ?? 0
}

// ─────────────────────────────────────────────
// Subscribe to real-time messages for a match
// ─────────────────────────────────────────────

export function subscribeToMessages(
  matchId: string,
  onNewMessage: (message: Message) => void
) {
  const supabase = getSupabaseBrowserClient()

  const channel = supabase
    .channel(`messages:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message)
      }
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel)
  }
}

// ─────────────────────────────────────────────
// Get the total message count for a match
// (used to determine "Ready to Meet" eligibility)
// ─────────────────────────────────────────────

export async function getMessageCount(matchId: string): Promise<number> {
  const supabase = getSupabaseBrowserClient()

  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('match_id', matchId)

  if (error) {
    console.error('Failed to get message count:', error.message)
    return 0
  }

  return count ?? 0
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Check if a string contains only emoji characters (no text).
 * Uses a broad Unicode emoji range check.
 */
function isEmojiOnly(str: string): boolean {
  // Remove zero-width joiners, variation selectors, and whitespace
  const stripped = str.replace(/[\s\uFE0F\u200D]/g, '')
  if (stripped.length === 0) return false

  // Match emoji ranges
  const emojiRegex =
    /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?)+$/u
  return emojiRegex.test(stripped)
}
