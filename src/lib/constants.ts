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
// Aligned with question-bank modules and scoring/constants DIMENSION_CONFIGS
export const MODULE_CONFIG = [
  { module: 1, title: 'Values & Priorities',     subtitle: 'Life direction, ethics & relationship priority', quotients: ['life_direction', 'moral_ethical', 'relationship_priority'] as const,  questionCount: 16, unlockCount: 3,  estimatedMinutes: 3, paid: false },
  { module: 2, title: 'Attachment Style',         subtitle: 'How you bond and relate',                      quotients: ['anxiety', 'avoidance', 'security'] as const,                          questionCount: 16, unlockCount: 5,  estimatedMinutes: 3, paid: false },
  { module: 3, title: 'Communication & Conflict', subtitle: 'How you handle disagreements',                 quotients: ['conflict_approach', 'repair_attempts', 'emotional_expression'] as const, questionCount: 16, unlockCount: 7,  estimatedMinutes: 3, paid: false },
  { module: 4, title: 'How You Love',             subtitle: 'Giving & receiving love languages',            quotients: ['receiving_language', 'giving_language'] as const,                      questionCount: 16, unlockCount: 10, estimatedMinutes: 3, paid: false },
  { module: 5, title: 'Hot Takes & Dealbreakers', subtitle: 'Boundaries, values & vulnerability',           quotients: ['boundaries', 'gender_dynamics', 'vulnerability'] as const,             questionCount: 16, unlockCount: 15, estimatedMinutes: 3, paid: false },
  { module: 6, title: 'Emotional Intelligence',   subtitle: 'Self-awareness, empathy & regulation',         quotients: ['self_awareness', 'empathy', 'emotional_regulation'] as const,          questionCount: 16, unlockCount: 20, estimatedMinutes: 3, paid: true, price: 4.99 },
  { module: 7, title: 'Lifestyle & Ambition',     subtitle: 'Pace, social energy & future vision',          quotients: ['pace_of_life', 'social_energy', 'future_vision'] as const,             questionCount: 10, unlockCount: 30, estimatedMinutes: 2, paid: true, price: 4.99 },
  { module: 8, title: 'Intimacy & Chemistry',     subtitle: 'Physical, emotional & desire dynamics',        quotients: ['physical_chemistry', 'emotional_intimacy', 'desire_dynamics'] as const, questionCount: 10, unlockCount: -1, estimatedMinutes: 2, paid: true, price: 4.99 },
] as const

// ── Progressive Unlock ──
export function getUnlockedProfileCount(modulesCompleted: number): number | null {
  // Index = modules completed → cumulative profiles unlocked; null = unlimited
  const cumulative = [0, 3, 8, 15, 25, 40, 60, 90, null]
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
