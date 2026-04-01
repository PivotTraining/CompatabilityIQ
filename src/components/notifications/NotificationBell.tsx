'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Notification } from '@/lib/supabase/types'

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function notificationIcon(type: string): string {
  switch (type) {
    case 'new_resonance':
      return '\u2764\uFE0F'   // heart
    case 'new_message':
      return '\uD83D\uDCAC'   // speech bubble
    case 'report_available':
      return '\uD83D\uDCCA'   // bar chart
    case 'assessment_reminder':
      return '\uD83C\uDFAF'   // target
    case 'weekly_digest':
      return '\uD83D\uDCE8'   // envelope
    default:
      return '\uD83D\uDD14'   // bell
  }
}

function notificationHref(notification: Notification): string {
  const data = (notification.data ?? {}) as Record<string, unknown>
  switch (notification.type) {
    case 'new_resonance':
      return '/app/matches'
    case 'new_message':
      return data.matchId ? `/app/chat/${data.matchId}` : '/app/chat'
    case 'report_available':
      return data.matchId ? `/app/matches/${data.matchId}/report` : '/app/matches'
    case 'assessment_reminder':
      return '/app/assessment'
    case 'weekly_digest':
      return '/app/matches'
    default:
      return '/app'
  }
}

// ═══════════════════════════════════════════
// Component
// ═══════════════════════════════════════════

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const supabase = getSupabaseBrowserClient()!

  // ─── Fetch notifications ───────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const res = await fetch('/api/notifications?limit=20')
      if (!res.ok) return

      const json = await res.json()
      setNotifications(json.notifications ?? [])
      setUnreadCount(json.unreadCount ?? 0)
    } catch (err) {
      console.error('[NotificationBell] fetch error:', err)
    }
  }, [])

  // ─── Initial load ──────────────────────
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // ─── Realtime subscription ─────────────
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function subscribe() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel('notifications-bell')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotification = payload.new as Notification
            setNotifications((prev) => [newNotification, ...prev].slice(0, 20))
            setUnreadCount((prev) => prev + 1)
          }
        )
        .subscribe()
    }

    subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  // ─── Close on outside click ────────────
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ─── Mark single as read ───────────────
  async function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notification.id }),
      })

      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }

    // Navigate
    window.location.href = notificationHref(notification)
    setIsOpen(false)
  }

  // ─── Mark all as read ──────────────────
  async function handleMarkAllRead() {
    setLoading(true)
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    })

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    setLoading(false)
  }

  // ─── Render ────────────────────────────
  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '8px',
          transition: 'background-color 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#d1d5db' }}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              minWidth: '18px',
              height: '18px',
              borderRadius: '9px',
              backgroundColor: '#E8735A',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              lineHeight: '1',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '8px',
            width: 'min(360px, calc(100vw - 32px))',
            maxHeight: '480px',
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(123, 104, 181, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#f3f4f6' }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7B68B5',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div
            style={{
              overflowY: 'auto',
              flex: 1,
              maxHeight: '420px',
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '40px 16px',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: notification.read
                      ? 'transparent'
                      : 'rgba(123, 104, 181, 0.08)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s',
                  }}
                >
                  {/* Icon */}
                  <span
                    style={{
                      fontSize: '20px',
                      lineHeight: '1',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {notificationIcon(notification.type)}
                  </span>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '2px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: notification.read ? '400' : '600',
                          color: notification.read ? '#d1d5db' : '#f3f4f6',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#7B68B5',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#d1d5db',
                        fontWeight: 500,
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {notification.body}
                    </p>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginTop: '4px',
                        display: 'block',
                      }}
                    >
                      {timeAgo(notification.created_at)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
