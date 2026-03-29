// CompatibleIQ -- Content Filter & PII Redaction
// Keeps users safe by removing personal info from messages.
// Users exchange details securely via the "Ready to Meet" feature.

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type FilterReasonType =
  | 'phone'
  | 'email'
  | 'address'
  | 'social_media'
  | 'url'

export interface FilterResult {
  clean: string
  wasFiltered: boolean
  filterReasons: FilterReasonType[]
  warningMessage?: string
}

// ─────────────────────────────────────────────
// Replacement text
// ─────────────────────────────────────────────

const REDACTION_TEXT =
  '[info removed -- use Ready to Meet when you\'re ready to exchange details]'

const WARNING_MESSAGE =
  "For your safety, we removed some personal info from that message. When you're both ready, use the 'Ready to Meet' feature to exchange details securely."

// ─────────────────────────────────────────────
// Detection patterns
// ─────────────────────────────────────────────

interface FilterRule {
  reason: FilterReasonType
  patterns: RegExp[]
}

const FILTER_RULES: FilterRule[] = [
  // ── Email ──
  {
    reason: 'email',
    patterns: [
      // Standard email
      /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
      // Obfuscated: "name at gmail dot com"
      /[a-zA-Z0-9._%+\-]+\s+at\s+[a-zA-Z0-9.\-]+\s+dot\s+[a-zA-Z]{2,}/gi,
    ],
  },

  // ── Phone numbers ──
  {
    reason: 'phone',
    patterns: [
      // +1 555 123 4567 or +1-555-123-4567
      /\+?1?[\s\-.]?\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}\b/g,
      // 555-1234 (7 digit)
      /\b\d{3}[\s\-.]?\d{4}\b/g,
      // Spelled-out digits: "five five five one two three four five six seven"
      /\b(?:zero|one|two|three|four|five|six|seven|eight|nine)(?:\s+(?:zero|one|two|three|four|five|six|seven|eight|nine)){6,}\b/gi,
      // Mixed: digits with spaces used to evade detection ("5 5 5 1 2 3 4 5 6 7")
      /\b\d(?:\s+\d){6,}\b/g,
    ],
  },

  // ── URLs ──
  {
    reason: 'url',
    patterns: [
      // http:// or https://
      /https?:\/\/[^\s]+/gi,
      // www.
      /\bwww\.[^\s]+/gi,
      // Common TLD patterns: something.com, something.co, something.io etc.
      /\b[a-zA-Z0-9\-]+\.(?:com|org|net|io|co|me|app|dev|xyz|info|biz|us|uk|ca)\b/gi,
    ],
  },

  // ── Social media handles ──
  {
    reason: 'social_media',
    patterns: [
      // @username (at least 2 chars to avoid false positives on single @ in text)
      /(?:^|(?<=\s))@[a-zA-Z0-9_]{2,}/g,
      // Platform keywords + handle patterns
      /\b(?:ig|insta|instagram|snap|snapchat|tiktok|twitter|fb|facebook|telegram|whatsapp|signal|discord)\b[\s:]*@?[a-zA-Z0-9_.]{2,}/gi,
      // "add me on" / "find me on" / "hit me up on" + platform
      /\b(?:add|find|hit|follow|message|dm|text)\s+me\s+(?:on|at|up\s+on)\s+(?:ig|insta|instagram|snap|snapchat|tiktok|twitter|fb|facebook|telegram|whatsapp|signal|discord)\b/gi,
    ],
  },

  // ── Street addresses ──
  {
    reason: 'address',
    patterns: [
      // Number + street name + optional suffix
      /\b\d{1,5}\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\s+(?:St(?:reet)?|Ave(?:nue)?|Blvd|Boulevard|Dr(?:ive)?|Ln|Lane|Rd|Road|Ct|Court|Pl|Place|Way|Cir(?:cle)?|Pkwy|Parkway|Hwy|Highway)\b\.?/gi,
      // PO Box
      /\bP\.?O\.?\s*Box\s+\d+/gi,
      // Zip code patterns (5 digits or 5+4)
      /\b\d{5}(?:\-\d{4})?\b/g,
    ],
  },
]

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

/**
 * Check message content and redact PII.
 * Returns the cleaned message and metadata about what was filtered.
 */
export function filterMessage(content: string): FilterResult {
  const reasons = new Set<FilterReasonType>()
  let clean = content

  for (const rule of FILTER_RULES) {
    for (const pattern of rule.patterns) {
      // Reset lastIndex for global regex reuse
      pattern.lastIndex = 0

      if (pattern.test(clean)) {
        reasons.add(rule.reason)
        // Reset again before replacing
        pattern.lastIndex = 0
        clean = clean.replace(pattern, REDACTION_TEXT)
      }
    }
  }

  const wasFiltered = reasons.size > 0
  const filterReasons = Array.from(reasons)

  return {
    clean,
    wasFiltered,
    filterReasons,
    warningMessage: wasFiltered ? WARNING_MESSAGE : undefined,
  }
}
