'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface PhotoModerationActionsProps {
  photoId: string
  onModerated: (photoId: string) => void
}

export default function PhotoModerationActions({ photoId, onModerated }: PhotoModerationActionsProps) {
  const [acting, setActing] = useState(false)

  async function handleAction(status: 'approved' | 'rejected') {
    setActing(true)
    try {
      const response = await fetch('/api/admin/photos/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId, status }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to update moderation status')
      }

      onModerated(photoId)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      alert(message)
    } finally {
      setActing(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction('approved')}
        disabled={acting}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: '#22C55E' }}
      >
        <CheckCircle className="w-4 h-4" />
        Approve
      </button>
      <button
        onClick={() => handleAction('rejected')}
        disabled={acting}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: '#EF4444' }}
      >
        <XCircle className="w-4 h-4" />
        Reject
      </button>
    </div>
  )
}
