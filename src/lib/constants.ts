// ── CIS Tier Definitions ──
export const CIS_TIERS = {
  rare:         { min: 86, max: 100, label: 'Rare Match',    color: '#9333EA', bg: '#F3E8FF' },
  synergistic:  { min: 66, max: 85,  label: 'Synergistic',   color: '#16A34A', bg: '#DCFCE7' },
  compatible:   { min: 41, max: 65,  label: 'Compatible',    color: '#2563EB', bg: '#DBEAFE' },
  misaligned:   { min: 0,  max: 40,  label: 'Misaligned',    color: '#6B7280', bg: '#F3F4F6' },
} as const

export type CISTierKey = keyof typeof CIS_TIERS

export function getCISTier(score: number): CISTierKey {
  if (score >= 86) return 'rare'
  if (score >= 66) return 'synergistic'
  if (score >= 41) return 'compatible'
  return 'misaligned'
}

// ── Core Quotient Domains (Layer 1) ──
export const CORE_QUOTIENTS = {
  VQ:  { name: 'Values Quotient',               weight: 0.25, matchType: 'mirror' as const,         color: '#7B68B5' },
  AQ:  { name: 'Attachment Quotient',            weight: 0.22, matchType: 'complementary' as const,  color: '#5B8DB8' },
  EQ:  { name: 'Emotional Intelligence Quotient', weight: 0.20, matchType: 'mirror' as const,        color: '#E8735A' },
  CQ:  { name: 'Conflict Quotient',             weight: 0.18, matchType: 'complementary' as const,  color: '#D4A017' },
  NQ:  { name: 'Neurobiological Quotient',       weight: 0.15, matchType: 'complementary' as const,  color: '#4CAF8A' },
  LQ:  { name: 'How You Love Quotient',         weight: 0.10, matchType: 'bidirectional' as const,  color: '#C25B8A' },
  GQ:  { name: 'Growth Quotient',               weight: 0.08, matchType: 'mirror' as const,         color: '#E07B39' },
  CSQ: { name: 'Cognitive Style Quotient',       weight: 0.07, matchType: 'flexible' as const,       color: '#6B9BD2' },
} as const

export type CoreQuotientKey = keyof typeof CORE_QUOTIENTS

// ── Financial Domains (Layer 2) ──
export const FINANCIAL_DOMAINS = {
  FMI: { name: 'Financial Mindset Index',        weight: 0.20, matchType: 'mirror' as const },
  FSB: { name: 'Spending Behavior Profile',      weight: 0.18, matchType: 'complementary' as const },
  FPL: { name: 'Financial Planning Quotient',    weight: 0.22, matchType: 'mirror' as const },
  FIQ: { name: 'Investment Intelligence Quotient', weight: 0.15, matchType: 'flexible' as const },
  FCM: { name: 'Financial Communication Score',  weight: 0.14, matchType: 'mirror' as const },
  CDF: { name: 'Credit & Debt Framework',        weight: 0.11, matchType: 'complementary' as const },
} as const

export type FinancialDomainKey = keyof typeof FINANCIAL_DOMAINS

// ── Shadow Clusters (Layer 3) ──
export const SHADOW_CLUSTERS = {
  ACC: { name: 'Accountability Index',      publicLabel: 'Accountability Index',          maxPenalty: 22 },
  EMP: { name: 'Empathy History Index',     publicLabel: 'Empathy History Index',         maxPenalty: 25 },
  STB: { name: 'Emotional Stability Pattern', publicLabel: 'Emotional Stability Pattern', maxPenalty: 20 },
  SAF: { name: 'Relational Safety Score',   publicLabel: 'Relational Safety Score',       maxPenalty: 30 },
  DEP: { name: 'Dependency & Coping Index', publicLabel: 'Dependency & Coping Index',     maxPenalty: 18 },
} as const

export type ShadowClusterKey = keyof typeof SHADOW_CLUSTERS

// ── Financial Shadow Flags ──
export const FINANCIAL_SHADOW_FLAGS = {
  FSF1: { name: 'Financial Infidelity Risk',     maxPenalty: 15 },
  FSF2: { name: 'Compulsive Spending Pattern',   maxPenalty: 12 },
  FSF3: { name: 'Financial Avoidance',           maxPenalty: 10 },
  FSF4: { name: 'High-Risk Financial Behavior',  maxPenalty: 18 },
  FSF5: { name: 'Financial Control Risk',        maxPenalty: 25 },
} as const

// ── Bonus Conditions ──
export const BONUS_CONDITIONS = {
  bothSecureAttachment:    { label: 'Both Secure Attachment',   points: 5 },
  bothGrowthMindset:       { label: 'Both Growth Mindset',     points: 3 },
  bothEarnedSecure:        { label: 'Both Earned Secure',      points: 4 },
  valuesAlignmentHigh:     { label: 'Values Alignment ≥90',    points: 4 },
  noShadowFlags:           { label: 'No Shadow Flags',         points: 6 },
  financialTransparencyHigh: { label: 'Financial Transparency High', points: 3 },
} as const

// ── CIS Formula Constants ──
export const CIS_WEIGHTS = {
  coreWeight: 0.85,
  finWeight: 0.15,
  safHardCapThreshold: 0.75,
  safHardCapMax: 35,
} as const

// ── Assessment Module Config ──
export const MODULE_CONFIG = [
  { module: 1, title: 'Who You Are',        subtitle: 'Values & Growth',        quotients: ['VQ', 'GQ'] as const,                      questionCount: 24, unlockCount: 3,  estimatedMinutes: 8  },
  { module: 2, title: 'How You Love',       subtitle: 'Attachment & Love',       quotients: ['AQ', 'LQ'] as const,                      questionCount: 22, unlockCount: 5,  estimatedMinutes: 7  },
  { module: 3, title: 'How You Feel',       subtitle: 'Emotional & Neurobiological', quotients: ['EQ', 'NQ'] as const,                  questionCount: 26, unlockCount: 7,  estimatedMinutes: 9  },
  { module: 4, title: 'How You Communicate', subtitle: 'Conflict & Cognitive Style', quotients: ['CQ', 'CSQ'] as const,                 questionCount: 20, unlockCount: 10, estimatedMinutes: 7  },
  { module: 5, title: 'Your Depth Profile', subtitle: 'Relational History',      quotients: ['ACC', 'EMP', 'STB', 'SAF', 'DEP'] as const, questionCount: 28, unlockCount: 15, estimatedMinutes: 10 },
  { module: 6, title: 'Money & Life',       subtitle: 'Financial Alignment',     quotients: ['FMI', 'FSB', 'FPL', 'FIQ', 'FCM', 'CDF'] as const, questionCount: 22, unlockCount: -1, estimatedMinutes: 8  },
] as const

// ── Progressive Unlock ──
export function getUnlockedProfileCount(modulesCompleted: number): number | null {
  const cumulative = [0, 3, 8, 15, 25, 40, null] // null = unlimited
  return cumulative[modulesCompleted] ?? 0
}

export function getTotalQuestions(): number {
  return MODULE_CONFIG.reduce((sum, m) => sum + m.questionCount, 0)
}

// ── App Limits ──
export const LIMITS = {
  maxPhotos: 6,
  minPhotos: 2,
  maxBioLength: 500,
  maxMessageLength: 2000,
  minAge: 18,
  maxAge: 99,
  defaultSearchRadius: 50,
  maxSearchRadius: 200,
  maxReportsBeforeSuspension: 3,
} as const
