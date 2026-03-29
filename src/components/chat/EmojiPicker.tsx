'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────
// Emoji data organized by category
// ─────────────────────────────────────────────

interface EmojiCategory {
  name: string
  emojis: string[]
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: 'Smileys',
    emojis: [
      '\u{1F60A}', '\u{1F60D}', '\u{1F970}', '\u{1F618}', '\u{1F609}',
      '\u{1F602}', '\u{1F923}', '\u{1F60E}', '\u{1F917}', '\u{1F914}',
      '\u{1F644}', '\u{1F60F}', '\u{1F972}', '\u{1F979}', '\u{1F973}',
      '\u{1F636}', '\u{1FAE3}',
    ],
  },
  {
    name: 'Hearts',
    emojis: [
      '\u{2764}\u{FE0F}', '\u{1F49C}', '\u{1FA77}', '\u{1F49B}',
      '\u{1F49A}', '\u{1F499}', '\u{1F90E}', '\u{1F5A4}', '\u{1F90D}',
      '\u{1F498}', '\u{1F49D}', '\u{1F496}', '\u{1F495}', '\u{1F48B}',
    ],
  },
  {
    name: 'Hands',
    emojis: [
      '\u{1F44B}', '\u{1F44D}', '\u{1F44F}', '\u{1F64F}', '\u{1F4AA}',
      '\u{1F91D}', '\u{270C}\u{FE0F}', '\u{1F91E}', '\u{1F919}',
      '\u{1F91F}', '\u{1F448}', '\u{1F449}', '\u{1F446}', '\u{1F44C}',
      '\u{1FAF6}',
    ],
  },
  {
    name: 'Nature',
    emojis: [
      '\u{1F33A}', '\u{1F339}', '\u{1F337}', '\u{1F33B}', '\u{1F338}',
      '\u{1F331}', '\u{2B50}', '\u{1F319}', '\u{2600}\u{FE0F}',
      '\u{1F308}', '\u{1F98B}', '\u{1F43E}', '\u{1F525}', '\u{2728}',
      '\u{1F31F}',
    ],
  },
]

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

interface EmojiPickerProps {
  isOpen: boolean
  onToggle: () => void
  onSelect: (emoji: string) => void
}

export default function EmojiPicker({
  isOpen,
  onToggle,
  onSelect,
}: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0)

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="p-2 text-gray-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-purple-500/10"
        aria-label="Open emoji picker"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-6 h-6"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={2.5} strokeLinecap="round" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      </button>
    )
  }

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className="p-2 text-purple-400 transition-colors rounded-lg bg-purple-500/10"
        aria-label="Close emoji picker"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-6 h-6"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={2.5} strokeLinecap="round" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      </button>

      {/* Picker panel */}
      <div className="absolute bottom-12 right-0 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
        {/* Category tabs */}
        <div className="flex border-b border-gray-700">
          {EMOJI_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveCategory(idx)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                idx === activeCategory
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Emoji grid */}
        <div className="p-3 grid grid-cols-7 gap-1 max-h-48 overflow-y-auto">
          {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, idx) => (
            <button
              key={`${emoji}-${idx}`}
              type="button"
              onClick={() => onSelect(emoji)}
              className="w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-purple-500/20 transition-colors"
              aria-label={`Insert ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
