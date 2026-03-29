// @ts-nocheck -- pending schema regen
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getSupabaseBrowserClient } from '../../lib/supabase/client'
import type { Message, ReportReason } from '../../lib/supabase/types'
import {
  sendMessage,
  getMessages,
  markAsRead,
  subscribeToMessages,
  getMessageCount,
} from '../../lib/messaging/chat-service'
import { filterMessage } from '../../lib/messaging/content-filter'
import { reportUser, blockUser } from '../../lib/messaging/safety'
import EmojiPicker from './EmojiPicker'

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const MAX_CHARS = 2000
const PAGE_SIZE = 50
const READY_TO_MEET_THRESHOLD = 10

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface ChatWindowProps {
  matchId: string
  otherUserId: string
  otherUserName: string
  onReadyToMeet?: () => void
  onBack?: () => void
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function ChatWindow({
  matchId,
  otherUserId,
  otherUserName,
  onReadyToMeet,
  onBack,
}: ChatWindowProps) {
  // State
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [filterWarning, setFilterWarning] = useState<string | null>(null)
  const [totalMessageCount, setTotalMessageCount] = useState(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // ── Get current user ──
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id)
    })
  }, [])

  // ── Load initial messages ──
  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const msgs = await getMessages(matchId, PAGE_SIZE)
      setMessages(msgs)
      setHasMore(msgs.length === PAGE_SIZE)
      await markAsRead(matchId)

      const count = await getMessageCount(matchId)
      setTotalMessageCount(count)

      setIsLoading(false)
    }
    load()
  }, [matchId])

  // ── Scroll to bottom on new messages ──
  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  // ── Real-time subscription ──
  useEffect(() => {
    const unsubscribe = subscribeToMessages(matchId, (newMessage) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.some((m) => m.id === newMessage.id)) return prev
        return [...prev, newMessage]
      })
      setTotalMessageCount((prev) => prev + 1)
      markAsRead(matchId)
    })

    return unsubscribe
  }, [matchId])

  // ── Load older messages on scroll up ──
  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current
    if (!container || !hasMore || isLoadingMore) return

    if (container.scrollTop < 100) {
      setIsLoadingMore(true)
      const oldest = messages[0]
      if (!oldest) {
        setIsLoadingMore(false)
        return
      }

      const olderMessages = await getMessages(matchId, PAGE_SIZE, oldest.created_at)
      if (olderMessages.length < PAGE_SIZE) {
        setHasMore(false)
      }
      if (olderMessages.length > 0) {
        // Preserve scroll position
        const prevHeight = container.scrollHeight
        setMessages((prev) => [...olderMessages, ...prev])
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - prevHeight
        })
      }
      setIsLoadingMore(false)
    }
  }, [hasMore, isLoadingMore, messages, matchId])

  // ── Send message ──
  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isSending) return

    // Check filter before sending (show warning but still send filtered version)
    const filterResult = filterMessage(trimmed)
    if (filterResult.wasFiltered && filterResult.warningMessage) {
      setFilterWarning(filterResult.warningMessage)
      setTimeout(() => setFilterWarning(null), 6000)
    }

    setIsSending(true)
    setInput('')
    setShowEmojiPicker(false)

    const sent = await sendMessage(matchId, trimmed)
    if (sent) {
      // Optimistic: the realtime subscription will add it, but add immediately too
      setMessages((prev) => {
        if (prev.some((m) => m.id === sent.id)) return prev
        return [...prev, sent]
      })
      setTotalMessageCount((prev) => prev + 1)
    }

    setIsSending(false)
    inputRef.current?.focus()
  }

  // ── Emoji selection ──
  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => {
      if (prev.length + emoji.length > MAX_CHARS) return prev
      return prev + emoji
    })
    inputRef.current?.focus()
  }

  // ── Key handler ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Report flow ──
  const handleReport = async (reason: ReportReason, details?: string) => {
    try {
      await reportUser(otherUserId, reason, details)
      setShowReportModal(false)
      setShowHeaderMenu(false)
    } catch {
      // Error handling is in the service
    }
  }

  // ── Block flow ──
  const handleBlock = async () => {
    if (!confirm(`Block ${otherUserName}? This will end your Resonance.`)) return
    try {
      await blockUser(otherUserId)
      setShowHeaderMenu(false)
      onBack?.()
    } catch {
      // Error handling is in the service
    }
  }

  // ── Message status display ──
  const getStatusIcon = (msg: Message) => {
    if (msg.sender_id !== currentUserId) return null
    if (msg.read_at) {
      return (
        <span className="text-purple-400 text-xs ml-1" title="Read">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" className="w-4 h-3 inline">
            <path d="M1 5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      )
    }
    return (
      <span className="text-gray-500 text-xs ml-1" title="Sent">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" className="w-3 h-3 inline">
          <path d="M1 5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    )
  }

  // ── Format timestamp ──
  const formatTime = (iso: string) => {
    const date = new Date(iso)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    }

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    }

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  // ── Ready to Meet eligibility ──
  const showReadyToMeet = totalMessageCount >= READY_TO_MEET_THRESHOLD

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-gray-950 text-white">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div>
            <h2 className="font-semibold text-lg">{otherUserName}</h2>
            <p className="text-xs text-gray-500">Resonance</p>
          </div>
        </div>

        {/* Header menu */}
        <div className="relative">
          <button
            onClick={() => setShowHeaderMenu(!showHeaderMenu)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            aria-label="Options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {showHeaderMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowHeaderMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setShowReportModal(true)
                    setShowHeaderMenu(false)
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Report {otherUserName}
                </button>
                <button
                  onClick={handleBlock}
                  className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors border-t border-gray-700"
                >
                  Block {otherUserName}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Safety notice ── */}
      <div className="px-4 py-2 bg-purple-950/30 border-b border-purple-900/30">
        <p className="text-xs text-purple-300/70 text-center">
          This conversation is text-only for your safety
        </p>
      </div>

      {/* ── Filter warning banner ── */}
      {filterWarning && (
        <div className="px-4 py-3 bg-amber-950/50 border-b border-amber-800/30">
          <p className="text-xs text-amber-300">{filterWarning}</p>
        </div>
      )}

      {/* ── Messages area ── */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {/* Loading older */}
        {isLoadingMore && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500">Loading older messages...</span>
          </div>
        )}

        {/* No more messages */}
        {!hasMore && messages.length > 0 && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-600">Beginning of conversation</span>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Say hello to start your conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMine
                      ? 'bg-purple-600 text-white rounded-br-md'
                      : 'bg-gray-800 text-gray-100 rounded-bl-md'
                  }`}
                >
                  <p className={`text-sm whitespace-pre-wrap break-words ${
                    msg.content_type === 'emoji' ? 'text-3xl leading-relaxed' : ''
                  }`}>
                    {msg.content}
                  </p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    isMine ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className={`text-[10px] ${
                      isMine ? 'text-purple-200/60' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.created_at)}
                    </span>
                    {getStatusIcon(msg)}
                  </div>
                </div>
              </div>
            )
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Ready to Meet CTA ── */}
      {showReadyToMeet && onReadyToMeet && (
        <div className="px-4 py-2 border-t border-gray-800">
          <button
            onClick={onReadyToMeet}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-900/30"
          >
            Ready to Meet? Exchange details securely
          </button>
        </div>
      )}

      {/* ── Input area ── */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          {/* Emoji picker */}
          <EmojiPicker
            isOpen={showEmojiPicker}
            onToggle={() => setShowEmojiPicker(!showEmojiPicker)}
            onSelect={handleEmojiSelect}
          />

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setInput(e.target.value)
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-2xl text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 max-h-32 overflow-y-auto"
              style={{
                height: 'auto',
                minHeight: '42px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`
              }}
            />
            {input.length > MAX_CHARS - 200 && (
              <span
                className={`absolute right-3 bottom-1.5 text-[10px] ${
                  input.length > MAX_CHARS - 50 ? 'text-red-400' : 'text-gray-500'
                }`}
              >
                {input.length}/{MAX_CHARS}
              </span>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl transition-colors"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Report Modal ── */}
      {showReportModal && (
        <ReportModal
          userName={otherUserName}
          onSubmit={handleReport}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Report Modal sub-component
// ─────────────────────────────────────────────

interface ReportModalProps {
  userName: string
  onSubmit: (reason: ReportReason, details?: string) => Promise<void>
  onClose: () => void
}

function ReportModal({ userName, onSubmit, onClose }: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason | null>(null)
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reasons: { value: ReportReason; label: string }[] = [
    { value: 'harassment', label: 'Harassment or abusive behavior' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'fake_profile', label: 'Fake or misleading profile' },
    { value: 'spam', label: 'Spam or scam' },
    { value: 'other', label: 'Other' },
  ]

  const handleSubmit = async () => {
    if (!reason) return
    setIsSubmitting(true)
    await onSubmit(reason, details || undefined)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold">Report {userName}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Your report is confidential. We take all reports seriously.
          </p>
        </div>

        <div className="px-6 py-4 space-y-3">
          {reasons.map((r) => (
            <label
              key={r.value}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                reason === r.value
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="report-reason"
                value={r.value}
                checked={reason === r.value}
                onChange={() => setReason(r.value)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  reason === r.value
                    ? 'border-purple-500'
                    : 'border-gray-600'
                }`}
              >
                {reason === r.value && (
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                )}
              </div>
              <span className="text-sm text-gray-300">{r.label}</span>
            </label>
          ))}

          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Add details (optional)"
            rows={3}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason || isSubmitting}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  )
}
