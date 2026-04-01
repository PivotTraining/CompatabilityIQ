'use client'

import { useState } from 'react'
import type { ConversationStarter } from '@/lib/matching/conversation-starters'

// ═══════════════════════════════════════════
// Props
// ═══════════════════════════════════════════

interface ConversationStartersProps {
  starters: ConversationStarter[]
  onSelect: (text: string) => void
}

// ═══════════════════════════════════════════
// Gradient Styles
// ═══════════════════════════════════════════

const CATEGORY_GRADIENTS: Record<ConversationStarter['category'], string> = {
  values: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.12) 100%)',
  lifestyle: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.12) 100%)',
  connection: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(236, 72, 153, 0.12) 100%)',
  fun: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(236, 72, 153, 0.12) 100%)',
}

const CATEGORY_BORDERS: Record<ConversationStarter['category'], string> = {
  values: 'rgba(147, 51, 234, 0.25)',
  lifestyle: 'rgba(16, 185, 129, 0.25)',
  connection: 'rgba(147, 51, 234, 0.25)',
  fun: 'rgba(245, 158, 11, 0.25)',
}

const CATEGORY_LABELS: Record<ConversationStarter['category'], string> = {
  values: 'Values',
  lifestyle: 'Lifestyle',
  connection: 'Connection',
  fun: 'Fun',
}

// ═══════════════════════════════════════════
// Component
// ═══════════════════════════════════════════

export default function ConversationStarters({ starters, onSelect }: ConversationStartersProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || starters.length === 0) return null

  return (
    <div className="px-4 py-3">
      <p
        className="text-xs font-medium mb-3 text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        Conversation starters based on your compatibility
      </p>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-x-visible scrollbar-hide">
        {starters.map((starter, index) => (
          <StarterCard
            key={index}
            starter={starter}
            onSelect={(text) => {
              onSelect(text)
              setDismissed(true)
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// StarterCard Sub-Component
// ═══════════════════════════════════════════

interface StarterCardProps {
  starter: ConversationStarter
  onSelect: (text: string) => void
}

function StarterCard({ starter, onSelect }: StarterCardProps) {
  return (
    <button
      onClick={() => onSelect(starter.text)}
      className="flex-shrink-0 w-[260px] md:w-auto flex flex-col gap-2 p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: CATEGORY_GRADIENTS[starter.category],
        borderColor: CATEGORY_BORDERS[starter.category],
      }}
    >
      {/* Icon + Category */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{starter.icon}</span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {CATEGORY_LABELS[starter.category]}
        </span>
      </div>

      {/* Prompt text */}
      <p
        className="text-sm leading-relaxed line-clamp-3"
        style={{ color: 'var(--text-primary)' }}
      >
        {starter.text}
      </p>

      {/* Send hint */}
      <span
        className="text-[11px] font-medium mt-auto pt-1"
        style={{ color: 'var(--ciq-purple)' }}
      >
        Tap to send
      </span>
    </button>
  )
}
