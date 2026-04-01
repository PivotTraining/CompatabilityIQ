// @ts-nocheck
// CompatibleIQ — CIQ Pulse Weekly Micro-Assessment
// Rotating question bank for weekly 3-question check-ins

// ─── Types ──────────────────────────────────────────────

export type PulseCategory =
  | 'emotional_awareness'
  | 'relationship_readiness'
  | 'self_growth'
  | 'communication'

export interface PulseOption {
  readonly value: number
  readonly label: string
}

export interface PulseQuestion {
  readonly id: string
  readonly text: string
  readonly category: PulseCategory
  readonly options: readonly PulseOption[]
}

// ─── Question Bank ──────────────────────────────────────

const PULSE_QUESTIONS: readonly PulseQuestion[] = [
  // ── Emotional Awareness (6 questions) ──
  {
    id: 'pulse_ea_01',
    category: 'emotional_awareness',
    text: 'How well did you recognize your emotions before reacting this week?',
    options: [
      { value: 1, label: 'I mostly reacted on autopilot' },
      { value: 2, label: 'I caught myself after the fact a few times' },
      { value: 3, label: 'I paused and noticed my feelings more often than not' },
      { value: 4, label: 'I consistently recognized my emotions before responding' },
    ],
  },
  {
    id: 'pulse_ea_02',
    category: 'emotional_awareness',
    text: 'When something upset you this week, how did you handle it?',
    options: [
      { value: 1, label: 'I bottled it up or exploded' },
      { value: 2, label: 'I vented but didn\'t really process it' },
      { value: 3, label: 'I took some time to sit with the feeling' },
      { value: 4, label: 'I named the emotion and worked through it thoughtfully' },
    ],
  },
  {
    id: 'pulse_ea_03',
    category: 'emotional_awareness',
    text: 'How in tune were you with other people\'s feelings this week?',
    options: [
      { value: 1, label: 'I was mostly in my own head' },
      { value: 2, label: 'I noticed when something was obviously off' },
      { value: 3, label: 'I picked up on subtle cues fairly often' },
      { value: 4, label: 'I felt deeply connected to what others were experiencing' },
    ],
  },
  {
    id: 'pulse_ea_04',
    category: 'emotional_awareness',
    text: 'How comfortable were you sitting with uncomfortable emotions this week?',
    options: [
      { value: 1, label: 'I avoided them at all costs' },
      { value: 2, label: 'I tried to push through but it was tough' },
      { value: 3, label: 'I allowed myself to feel them without rushing' },
      { value: 4, label: 'I embraced discomfort as part of my growth' },
    ],
  },
  {
    id: 'pulse_ea_05',
    category: 'emotional_awareness',
    text: 'Did you notice any emotional patterns repeating this week?',
    options: [
      { value: 1, label: 'I didn\'t think about it at all' },
      { value: 2, label: 'I noticed something familiar but couldn\'t name it' },
      { value: 3, label: 'I spotted a pattern and thought about why' },
      { value: 4, label: 'I identified a pattern and actively tried to shift it' },
    ],
  },
  {
    id: 'pulse_ea_06',
    category: 'emotional_awareness',
    text: 'How honest were you with yourself about how you\'re really doing?',
    options: [
      { value: 1, label: 'I told myself I was fine without checking in' },
      { value: 2, label: 'I half-acknowledged some things' },
      { value: 3, label: 'I was mostly honest, even when it was hard' },
      { value: 4, label: 'I gave myself a real, unfiltered check-in' },
    ],
  },

  // ── Relationship Readiness (6 questions) ──
  {
    id: 'pulse_rr_01',
    category: 'relationship_readiness',
    text: 'How open were you to genuine connection with someone new this week?',
    options: [
      { value: 1, label: 'I kept my walls up completely' },
      { value: 2, label: 'I was open in theory but guarded in practice' },
      { value: 3, label: 'I let someone in a little more than usual' },
      { value: 4, label: 'I showed up authentically and was open to what came' },
    ],
  },
  {
    id: 'pulse_rr_02',
    category: 'relationship_readiness',
    text: 'How did you handle a moment of vulnerability this week?',
    options: [
      { value: 1, label: 'I shut it down quickly' },
      { value: 2, label: 'I felt uncomfortable but stayed in the moment briefly' },
      { value: 3, label: 'I leaned into it even though it felt risky' },
      { value: 4, label: 'I shared something real and felt stronger for it' },
    ],
  },
  {
    id: 'pulse_rr_03',
    category: 'relationship_readiness',
    text: 'How much did past experiences influence how you showed up this week?',
    options: [
      { value: 1, label: 'Old hurts were running the show' },
      { value: 2, label: 'I caught myself projecting a couple of times' },
      { value: 3, label: 'I noticed old patterns but didn\'t let them take over' },
      { value: 4, label: 'I responded to the present moment, not the past' },
    ],
  },
  {
    id: 'pulse_rr_04',
    category: 'relationship_readiness',
    text: 'How clearly do you know what you want in a partner right now?',
    options: [
      { value: 1, label: 'Honestly, I have no idea' },
      { value: 2, label: 'I have a vague sense but nothing concrete' },
      { value: 3, label: 'I know my core needs and deal-breakers' },
      { value: 4, label: 'I have deep clarity on what I need and why' },
    ],
  },
  {
    id: 'pulse_rr_05',
    category: 'relationship_readiness',
    text: 'How well did you maintain your own identity while connecting with others?',
    options: [
      { value: 1, label: 'I lost myself trying to fit in or please people' },
      { value: 2, label: 'I bent more than I should have' },
      { value: 3, label: 'I stayed true to myself most of the time' },
      { value: 4, label: 'I was fully myself and still connected deeply' },
    ],
  },
  {
    id: 'pulse_rr_06',
    category: 'relationship_readiness',
    text: 'How would you rate your emotional availability this week?',
    options: [
      { value: 1, label: 'Completely unavailable — too much going on' },
      { value: 2, label: 'Partially available but distracted' },
      { value: 3, label: 'Present and engaged for the most part' },
      { value: 4, label: 'Fully present and emotionally open' },
    ],
  },

  // ── Self-Growth (6 questions) ──
  {
    id: 'pulse_sg_01',
    category: 'self_growth',
    text: 'Did you do something this week that pushed you outside your comfort zone?',
    options: [
      { value: 1, label: 'Not at all — I stayed safe' },
      { value: 2, label: 'I thought about it but didn\'t follow through' },
      { value: 3, label: 'I took a small step into unfamiliar territory' },
      { value: 4, label: 'I deliberately challenged myself and grew from it' },
    ],
  },
  {
    id: 'pulse_sg_02',
    category: 'self_growth',
    text: 'How did you respond to feedback or criticism this week?',
    options: [
      { value: 1, label: 'I got defensive or shut down' },
      { value: 2, label: 'I heard it but felt stung for a while' },
      { value: 3, label: 'I took what was useful and let the rest go' },
      { value: 4, label: 'I genuinely welcomed it as a chance to improve' },
    ],
  },
  {
    id: 'pulse_sg_03',
    category: 'self_growth',
    text: 'How well did you prioritize your own well-being this week?',
    options: [
      { value: 1, label: 'I completely neglected myself' },
      { value: 2, label: 'I squeezed in some self-care as an afterthought' },
      { value: 3, label: 'I made intentional time for things that recharge me' },
      { value: 4, label: 'Self-care was a non-negotiable priority' },
    ],
  },
  {
    id: 'pulse_sg_04',
    category: 'self_growth',
    text: 'Did you learn something new about yourself this week?',
    options: [
      { value: 1, label: 'I wasn\'t paying attention to that' },
      { value: 2, label: 'Maybe, but I didn\'t dig into it' },
      { value: 3, label: 'I had a small insight that made me think' },
      { value: 4, label: 'I had a meaningful realization that shifted my perspective' },
    ],
  },
  {
    id: 'pulse_sg_05',
    category: 'self_growth',
    text: 'How intentional were you about your personal goals this week?',
    options: [
      { value: 1, label: 'I didn\'t think about them at all' },
      { value: 2, label: 'They crossed my mind but I didn\'t act on them' },
      { value: 3, label: 'I took at least one concrete step toward a goal' },
      { value: 4, label: 'I was focused and made real progress' },
    ],
  },
  {
    id: 'pulse_sg_06',
    category: 'self_growth',
    text: 'How kind were you to yourself when things didn\'t go perfectly?',
    options: [
      { value: 1, label: 'I was my own worst critic' },
      { value: 2, label: 'I was pretty hard on myself' },
      { value: 3, label: 'I gave myself some grace' },
      { value: 4, label: 'I treated myself with real compassion' },
    ],
  },

  // ── Communication (6 questions) ──
  {
    id: 'pulse_co_01',
    category: 'communication',
    text: 'How well did you express what you actually needed this week?',
    options: [
      { value: 1, label: 'I didn\'t — I hoped people would figure it out' },
      { value: 2, label: 'I hinted but didn\'t come right out and say it' },
      { value: 3, label: 'I spoke up clearly in most situations' },
      { value: 4, label: 'I communicated my needs directly and respectfully' },
    ],
  },
  {
    id: 'pulse_co_02',
    category: 'communication',
    text: 'How present were you during conversations this week?',
    options: [
      { value: 1, label: 'I was on my phone or mentally elsewhere' },
      { value: 2, label: 'I was half-listening most of the time' },
      { value: 3, label: 'I was engaged and attentive in most conversations' },
      { value: 4, label: 'I was fully present — listening to understand, not just respond' },
    ],
  },
  {
    id: 'pulse_co_03',
    category: 'communication',
    text: 'When you disagreed with someone, how did you handle it?',
    options: [
      { value: 1, label: 'I avoided it completely or got confrontational' },
      { value: 2, label: 'I said my piece but it felt tense' },
      { value: 3, label: 'I shared my view while respecting theirs' },
      { value: 4, label: 'We had a real dialogue and both felt heard' },
    ],
  },
  {
    id: 'pulse_co_04',
    category: 'communication',
    text: 'How well did you listen without planning your response this week?',
    options: [
      { value: 1, label: 'I was always formulating my reply' },
      { value: 2, label: 'I caught myself planning responses a lot' },
      { value: 3, label: 'I genuinely listened first most of the time' },
      { value: 4, label: 'I practiced deep listening and it changed the conversation' },
    ],
  },
  {
    id: 'pulse_co_05',
    category: 'communication',
    text: 'Did you have a conversation this week that felt truly meaningful?',
    options: [
      { value: 1, label: 'No — everything stayed surface-level' },
      { value: 2, label: 'One or two moments went a little deeper' },
      { value: 3, label: 'I had at least one conversation that really mattered' },
      { value: 4, label: 'I had deep, genuine exchanges that left me feeling connected' },
    ],
  },
  {
    id: 'pulse_co_06',
    category: 'communication',
    text: 'How well did you set and maintain boundaries in conversations this week?',
    options: [
      { value: 1, label: 'I let people walk all over me or was too rigid' },
      { value: 2, label: 'I struggled but tried' },
      { value: 3, label: 'I held my boundaries with most people' },
      { value: 4, label: 'I set clear, kind boundaries and felt good about it' },
    ],
  },
] as const

// ─── Weekly Question Selection ──────────────────────────

/**
 * Deterministically selects 3 questions for a given week number.
 * Rotates through the bank using modulo arithmetic, ensuring each
 * week draws from different categories when possible.
 */
export function getWeeklyQuestions(weekNumber: number): readonly PulseQuestion[] {
  const totalQuestions = PULSE_QUESTIONS.length
  const questionsPerCategory = 6
  const categories: readonly PulseCategory[] = [
    'emotional_awareness',
    'relationship_readiness',
    'self_growth',
    'communication',
  ]

  // Pick 3 categories for this week (rotating which 3 of 4 are used)
  const skippedCategoryIndex = weekNumber % categories.length
  const selectedCategories = categories.filter(
    (_, index) => index !== skippedCategoryIndex
  )

  // For each selected category, pick one question using week rotation
  const questions = selectedCategories.map((category, categoryOffset) => {
    const categoryQuestions = PULSE_QUESTIONS.filter(
      (q) => q.category === category
    )
    const questionIndex =
      Math.floor(weekNumber / categories.length + categoryOffset) %
      categoryQuestions.length
    return categoryQuestions[questionIndex]
  })

  return questions
}

/**
 * Calculates the ISO 8601 week number (Monday-based) for a given date.
 */
export function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  )
  // Set to nearest Thursday: current date + 4 - day number (Monday=1, Sunday=7)
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  )
  return weekNo
}

/**
 * Returns the ISO year for week numbering (may differ from calendar year
 * at year boundaries).
 */
export function getISOWeekYear(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  )
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  return d.getUTCFullYear()
}
