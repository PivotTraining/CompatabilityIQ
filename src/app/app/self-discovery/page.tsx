'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { DIMENSION_CONFIGS } from '@/lib/scoring/constants'
import CIQCard from '@/components/cards/CIQCard'
import {
  Brain,
  Heart,
  MessageCircle,
  Sparkles,
  Target,
  Users,
  ArrowRight,
  Share2,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Link2,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────

interface DimensionData {
  dimensionId: string
  dimensionName: string
  overallScore: number
  subScaleScores: Record<string, number>
  attachmentStyle?: string
  conflictApproach?: string
  loveLangProfile?: {
    receivingLanguages: string[]
    givingLanguages: string[]
    receivingTally: Record<string, number>
    givingTally: Record<string, number>
    flexibilityScore: number
  }
}

// ─── Constants ──────────────────────────────────────────

const DIMENSION_COLORS: Record<string, string> = {
  values: '#7B68B5',
  attachment: '#5B8DB8',
  communication: '#D4A017',
  emotional_intelligence: '#E8735A',
  lifestyle_ambition: '#4CAF8A',
  how_you_love: '#C25B8A',
  hot_takes: '#FF6B6B',
}

const DIMENSION_ICONS: Record<string, typeof Brain> = {
  values: Target,
  attachment: Heart,
  communication: MessageCircle,
  emotional_intelligence: Brain,
  lifestyle_ambition: Sparkles,
  how_you_love: Heart,
  hot_takes: Flame,
}

const ATTACHMENT_LABELS: Record<string, string> = {
  secure: 'Secure',
  anxious_preoccupied: 'Anxious-Preoccupied',
  dismissive_avoidant: 'Dismissive-Avoidant',
  fearful_avoidant: 'Fearful-Avoidant',
  earned_secure: 'Earned Secure',
}

const ATTACHMENT_DEEP_PROFILES: Record<string, {
  summary: string
  inRelationships: string
  needsFromPartner: string
  growthEdge: string
  bestMatchWith: string[]
  challengesWith: string[]
}> = {
  secure: {
    summary: 'You approach relationships from a place of emotional stability and trust. You can be vulnerable without losing yourself, and you give your partner space without feeling threatened.',
    inRelationships: 'You communicate your needs directly, repair conflicts quickly, and can self-soothe during disagreements. You don\'t need constant reassurance, but you welcome intimacy and closeness. Your emotional regulation allows you to hold space for a partner who may be less stable.',
    needsFromPartner: 'Honesty, consistency, and someone willing to grow. You don\'t need a partner to complete you — you want someone who adds depth to an already full life.',
    growthEdge: 'Sometimes your stability can come across as emotional distance. Make sure you\'re actively expressing your feelings, not just managing them.',
    bestMatchWith: ['Secure', 'Earned Secure', 'Anxious-Preoccupied (you stabilize them)'],
    challengesWith: ['Dismissive-Avoidant (may frustrate your desire for connection)'],
  },
  anxious_preoccupied: {
    summary: 'You love deeply and feel deeply. Your emotional radar is highly attuned to shifts in your partner\'s mood, availability, and energy. When things feel off, your system sounds the alarm — sometimes louder than the situation warrants.',
    inRelationships: 'You invest heavily and early. You think about your partner constantly, want frequent reassurance, and may interpret silence or distance as rejection. Your love language is often proximity and verbal affirmation. You\'re the one texting "are we okay?" after a slightly off phone call.',
    needsFromPartner: 'Consistency above all. Clear communication, regular check-ins, and someone who doesn\'t punish you for needing reassurance. You thrive when your partner is proactive about connection.',
    growthEdge: 'Learning to self-soothe before seeking external reassurance. The gap between "I feel anxious" and "something is actually wrong" is where your growth lives. Meditation, journaling, and secure friendships can help regulate your nervous system.',
    bestMatchWith: ['Secure (they ground you)', 'Earned Secure (they understand the journey)'],
    challengesWith: ['Dismissive-Avoidant (creates pursue-withdraw spiral)', 'Another Anxious-Preoccupied (amplifies anxiety)'],
  },
  dismissive_avoidant: {
    summary: 'You\'re self-reliant to your core. You learned early that depending on others leads to disappointment, so you built an emotional fortress. You\'re capable, competent, and often the calmest person in the room — but your independence can create distance.',
    inRelationships: 'You value your autonomy fiercely. Too much closeness feels suffocating, and you may pull away when a partner needs more emotional engagement. You\'re comfortable being alone, and sometimes prefer it. You process feelings internally and may seem emotionally "flat" to partners who crave visible emotion.',
    needsFromPartner: 'Someone who respects your space and doesn\'t interpret your need for solitude as rejection. You connect best through shared activities and intellectual engagement rather than emotional processing.',
    growthEdge: 'Recognizing that vulnerability is not weakness. Your independence is a strength, but when it becomes a wall, it prevents the intimacy that healthy relationships require. Practice naming your emotions out loud, even when it feels unnecessary.',
    bestMatchWith: ['Secure (they give you space without abandoning)', 'Another Avoidant (parallel play works)'],
    challengesWith: ['Anxious-Preoccupied (their need triggers your withdrawal)', 'Fearful-Avoidant (too much unpredictability)'],
  },
  fearful_avoidant: {
    summary: 'You carry two contradictory impulses: a deep desire for love and an equally deep fear of it. You want closeness but pull away when it gets real. This isn\'t confusion — it\'s a protective response from early experiences where love came with risk.',
    inRelationships: 'You oscillate. One day you\'re all-in, the next you\'re creating distance. You may test your partner\'s loyalty through push-pull dynamics without realizing it. You feel things intensely but have difficulty trusting that those feelings are safe to express.',
    needsFromPartner: 'Patience and predictability. A partner who doesn\'t chase when you pull away, and doesn\'t punish you when you come back. Someone who creates safety without pressure.',
    growthEdge: 'Therapy or coached self-reflection is especially valuable for fearful-avoidant patterns. The work is in building tolerance for sustained closeness — learning that staying present in a relationship won\'t result in the pain you\'ve experienced before.',
    bestMatchWith: ['Secure (their stability creates safety)', 'Earned Secure (they understand the struggle)'],
    challengesWith: ['Another Fearful-Avoidant (too volatile)', 'Anxious-Preoccupied (triggers your withdrawal reflex)'],
  },
  earned_secure: {
    summary: 'You weren\'t born secure — you built it. Through self-awareness, therapy, or hard-won relationship experience, you\'ve developed the emotional stability that others take for granted. This makes your security even more resilient because it\'s conscious.',
    inRelationships: 'You combine emotional depth with stability. You understand attachment theory intuitively because you\'ve lived it. You can recognize when old patterns are activating and choose a different response. You bring compassion to your partner\'s insecurities because you\'ve navigated your own.',
    needsFromPartner: 'Someone who values growth as much as you do. You\'ve done the work, and you need a partner who is willing to do theirs. You don\'t need perfection — you need effort and honesty.',
    growthEdge: 'Don\'t over-identify as the "healed" one in the relationship. Your earned security is real, but under extreme stress, old patterns can resurface. Stay humble about your own triggers.',
    bestMatchWith: ['Secure', 'Another Earned Secure', 'Anxious-Preoccupied (you can help them feel safe)'],
    challengesWith: ['Partners unwilling to grow or reflect'],
  },
}

const CONFLICT_LABELS: Record<string, string> = {
  confronter: 'Confronter',
  avoider: 'Avoider',
  collaborator: 'Collaborator',
  accommodator: 'Accommodator',
  unclassified: 'Adaptive',
}

const CONFLICT_DEEP_PROFILES: Record<string, {
  summary: string
  inConflict: string
  strengths: string[]
  blindSpots: string[]
  repairStyle: string
  partnerAdvice: string
}> = {
  confronter: {
    summary: 'You believe problems should be addressed head-on, in the moment. You don\'t avoid difficult conversations — in fact, you may initiate them. Your directness is a strength, but it can overwhelm a partner who needs time to process.',
    inConflict: 'You escalate quickly, speak candidly, and want resolution now. You interpret silence as avoidance and may push harder when a partner withdraws. You\'d rather have a heated argument than sweep something under the rug.',
    strengths: ['Nothing festers unresolved', 'Partners always know where they stand', 'Issues get addressed before they compound', 'You model courage in difficult conversations'],
    blindSpots: ['Can overwhelm quieter partners', 'May prioritize "winning" over understanding', 'Timing — raising issues when both aren\'t ready', 'Your intensity can trigger a partner\'s fight-or-flight'],
    repairStyle: 'You repair by resolving. Once the issue is addressed, you move on quickly. You may need to learn that for some partners, emotional repair (feeling heard) matters more than logical resolution.',
    partnerAdvice: 'Your ideal conflict partner is someone who can match your energy without crumbling — a Collaborator or another Confronter who shares your "let\'s fix this now" mentality.',
  },
  avoider: {
    summary: 'You prefer to let things settle before addressing them. You believe that most problems either resolve themselves or become clearer with time. You\'re not afraid of conflict — you just don\'t think every disagreement needs to be a conversation.',
    inConflict: 'You go quiet. You need time and space to process before you can articulate what you\'re feeling. Being pressed for an immediate response makes you shut down further. You\'re thinking, not ignoring — but your partner may not know the difference.',
    strengths: ['Keeps things calm during high-emotion moments', 'Avoids unnecessary escalation', 'Thoughtful and measured when you do speak', 'Creates space for both partners to cool down'],
    blindSpots: ['Issues can fester when never addressed', 'Partner may feel invisible or unimportant', 'Resentment can build silently', 'Your silence can be misread as indifference'],
    repairStyle: 'You repair through proximity and time. You come back to the topic when you\'re ready, often with more clarity. The problem is your partner may have been waiting anxiously the entire time.',
    partnerAdvice: 'You need a partner who doesn\'t interpret your need for space as abandonment. A Collaborator or Accommodator gives you room while still ensuring issues get resolved.',
  },
  collaborator: {
    summary: 'You approach conflict as a team sport. When a problem arises, your instinct is "how do we solve this together?" You de-escalate naturally, validate your partner\'s feelings, and look for win-win solutions. You\'re the relationship\'s natural mediator.',
    inConflict: 'You listen first, then respond. You restate your partner\'s position to confirm understanding before offering your own. You rarely raise your voice and you\'re uncomfortable with hostility. You may over-process or talk an issue to death trying to reach perfect resolution.',
    strengths: ['Both partners feel heard and valued', 'Conflicts rarely escalate destructively', 'Builds trust and emotional safety', 'Models healthy communication for the relationship'],
    blindSpots: ['Can over-process — not every issue needs a 45-minute debrief', 'May avoid asserting your own needs to preserve harmony', 'Can become people-pleasing under sustained pressure', 'Sometimes a quick decision beats a collaborative one'],
    repairStyle: 'You repair by processing together — talking through what happened, why, and how to prevent it. This is healthy, but some partners need action (a hug, a gesture) before words.',
    partnerAdvice: 'You pair well with almost everyone, but you\'re most fulfilled with someone who values intentional communication as much as you do. A Confronter can push you to be more decisive; an Accommodator may frustrate you by never pushing back.',
  },
  accommodator: {
    summary: 'You prioritize your partner\'s comfort and the relationship\'s harmony over your own position. You\'re flexible, adaptive, and willing to compromise — sometimes before the other person even asks. Your generosity is genuine, but it can come at a cost.',
    inConflict: 'You yield quickly. You may agree with your partner\'s position before fully exploring your own. You avoid tension by giving in, and you may minimize your own feelings ("it\'s not that big a deal"). You\'d rather absorb the discomfort than create it.',
    strengths: ['Partner feels prioritized and valued', 'Conflicts resolve quickly with minimal damage', 'Highly adaptive — you can work with any personality', 'Creates a warm, low-conflict environment'],
    blindSpots: ['Your own needs may go chronically unmet', 'Can breed resentment over time', 'Partner may never learn your real boundaries', 'You may lose yourself in the relationship gradually'],
    repairStyle: 'You repair by reconnecting emotionally — a hug, a kind word, resuming normalcy. But if the underlying issue was your unmet need, the "repair" may just be a reset to the same dynamic.',
    partnerAdvice: 'You need a partner who actively asks about your needs — someone who notices that you\'re always the one compromising and insists on reciprocity. A Collaborator is ideal; a Confronter may steamroll you.',
  },
  unclassified: {
    summary: 'You don\'t have a single dominant conflict style — you adapt to the situation, the person, and the stakes. This flexibility is a strength, but it can also make your behavior unpredictable to partners who want consistency.',
    inConflict: 'Your approach varies. Sometimes you confront directly, other times you need space. You may accommodate in low-stakes conflicts but dig in on things that matter deeply. This adaptability means you don\'t have the blind spots of a single style, but you also don\'t have the reliability.',
    strengths: ['Flexible and responsive to context', 'No rigid blind spots', 'Can match your partner\'s communication style', 'Effective across different types of disagreements'],
    blindSpots: ['Partners may find you unpredictable', 'You may lack a consistent "repair" process', 'Under extreme stress, you may default to a less healthy pattern', 'Hard for partners to learn "what works" with you'],
    repairStyle: 'Your repair style shifts with the conflict. This can be powerful (you give each partner what they need) or confusing (they don\'t know what to expect from you).',
    partnerAdvice: 'You work best with a partner who is adaptable themselves — a Collaborator who can read the room and adjust. Avoid rigid Confronters who expect the same energy every time.',
  },
}

const LOVE_STYLE_LABELS: Record<string, string> = {
  words_of_affirmation: 'Words of Affirmation',
  acts_of_service: 'Acts of Service',
  receiving_gifts: 'Receiving Gifts',
  quality_time: 'Quality Time',
  physical_touch: 'Physical Touch',
}

// ─── Component ──────────────────────────────────────────

export default function SelfDiscoveryDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [loading, setLoading] = useState(true)
  const [dimensions, setDimensions] = useState<DimensionData[]>([])
  const [profile, setProfile] = useState<{
    firstName: string
    locationCity: string | null
    locationState: string | null
  } | null>(null)
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [reportPurchased, setReportPurchased] = useState(false)
  const [purchasingReport, setPurchasingReport] = useState(false)
  const [showCIQCard, setShowCIQCard] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)

  // Show a brief toast notification
  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  // Share self-discovery profile via Web Share API with clipboard fallback
  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/app/self-discovery`
    const shareData = {
      title: `${profile?.firstName || 'My'} Compatibility Profile - CompatibleIQ`,
      text: `Check out my compatibility profile on CompatibleIQ! See my attachment style, EQ, love languages, and more.`,
      url: profileUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(profileUrl)
        showToast('Link copied to clipboard!')
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        await navigator.clipboard.writeText(profileUrl)
        showToast('Link copied to clipboard!')
      }
    }
  }

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))

  // Fetch data
  useEffect(() => {
    if (!user || !supabase) return

    const fetchData = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, location_city, location_state, assessment_completed')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile({
          firstName: profileData.first_name || 'You',
          locationCity: profileData.location_city,
          locationState: profileData.location_state,
        })
        setAssessmentComplete(!!profileData.assessment_completed)
      }

      // Fetch dimension scores
      const { data: scores } = await supabase
        .from('dimension_scores')
        .select('*')
        .eq('user_id', user.id)

      if (scores && scores.length > 0) {
        const dims: DimensionData[] = scores.map((row: any) => {
          const config = DIMENSION_CONFIGS[row.dimension_id as keyof typeof DIMENSION_CONFIGS]
          const subScales = typeof row.sub_scale_scores === 'string'
            ? JSON.parse(row.sub_scale_scores)
            : row.sub_scale_scores || {}

          return {
            dimensionId: row.dimension_id,
            dimensionName: config?.name || row.dimension_id,
            overallScore: row.overall_score || 3.0,
            subScaleScores: subScales,
            attachmentStyle: subScales._attachmentStyle || subScales.attachment_style || subScales.style,
            conflictApproach: subScales._conflictApproach || subScales.conflict_approach || subScales.approach,
            loveLangProfile: subScales._loveLangProfile || subScales.loveLangProfile,
          }
        })
        setDimensions(dims)
      }

      // Check if report already purchased
      const { data: reportData } = await supabase
        .from('self_discovery_reports')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (reportData) setReportPurchased(true)

      setLoading(false)
    }

    fetchData()
  }, [user, supabase])

  // Computed values
  const attachmentDim = dimensions.find((d) => d.dimensionId === 'attachment')
  const commDim = dimensions.find((d) => d.dimensionId === 'communication')
  const eiDim = dimensions.find((d) => d.dimensionId === 'emotional_intelligence')
  const valuesDim = dimensions.find((d) => d.dimensionId === 'values')
  const loveLangDim = dimensions.find((d) => d.dimensionId === 'how_you_love')
  const hotTakesDim = dimensions.find((d) => d.dimensionId === 'hot_takes')

  const attachmentStyle = attachmentDim?.attachmentStyle || 'secure'
  const conflictApproach = commDim?.conflictApproach || 'collaborator'

  // EQ breakdown
  const eqBreakdown = useMemo(() => ({
    'Self-Awareness': eiDim?.subScaleScores?.self_awareness || 3.0,
    'Self-Regulation': eiDim?.subScaleScores?.emotional_regulation || 3.0,
    'Empathy': eiDim?.subScaleScores?.empathy || 3.0,
    'Social Skills': ((eiDim?.subScaleScores?.empathy || 3.0) + (eiDim?.subScaleScores?.self_awareness || 3.0)) / 2,
  }), [eiDim])

  // How you love ranking
  const loveLanguageRanking = useMemo(() => {
    const allLangs = ['words_of_affirmation', 'acts_of_service', 'receiving_gifts', 'quality_time', 'physical_touch']
    const tally = loveLangDim?.loveLangProfile?.receivingTally || {}
    const total = Object.values(tally).reduce((sum: number, v: number) => sum + v, 0) || 1

    return allLangs
      .map((lang) => ({
        key: lang,
        label: LOVE_STYLE_LABELS[lang] || lang,
        percentage: Math.round(((tally[lang] || 0) / total) * 100) || 20,
      }))
      .sort((a, b) => b.percentage - a.percentage)
  }, [loveLangDim])

  // Dating readiness score — weighted composite
  const datingReadinessScore = useMemo(() => {
    if (dimensions.length === 0) return 0
    const weights: Record<string, number> = {
      values: 0.12, attachment: 0.28, communication: 0.20,
      emotional_intelligence: 0.22, lifestyle_ambition: 0.08, how_you_love: 0.05,
      hot_takes: 0.05,
    }
    let total = 0, totalWeight = 0
    for (const dim of dimensions) {
      const w = weights[dim.dimensionId] || 0.05
      total += (dim.overallScore / 5) * 100 * w
      totalWeight += w
    }
    return totalWeight > 0 ? Math.round(total / totalWeight) : 50
  }, [dimensions])

  // Readiness tier
  const readinessTier = useMemo(() => {
    if (datingReadinessScore >= 82) return { label: 'Highly Ready', color: '#22C55E', desc: 'Your profile shows exceptional emotional maturity and relationship readiness. You have the self-awareness and tools to build a healthy, lasting partnership.' }
    if (datingReadinessScore >= 68) return { label: 'Strong Foundation', color: 'var(--ciq-purple)', desc: 'You have a solid emotional base for dating. Focus on your growth edges and you\'ll be in an excellent position to attract and sustain a great relationship.' }
    if (datingReadinessScore >= 52) return { label: 'Developing', color: '#D4A017', desc: 'You\'re building the skills that matter most. Some dimensions need attention, but the self-awareness you\'re showing by taking this assessment is itself a strength.' }
    return { label: 'Growth Phase', color: '#E8735A', desc: 'Investing in personal development right now will pay massive dividends in your next relationship. Focus on your lowest-scoring dimensions first.' }
  }, [datingReadinessScore])

  // Top traits for CIQ Card
  const topTraits = useMemo(() => {
    const traits: string[] = []
    if (attachmentStyle === 'secure' || attachmentStyle === 'earned_secure') traits.push('Emotionally Grounded')
    else if (attachmentStyle === 'anxious_preoccupied') traits.push('Deeply Connected')
    else if (attachmentStyle === 'dismissive_avoidant') traits.push('Self-Reliant')
    else traits.push('Emotionally Complex')
    if (eiDim && eiDim.overallScore >= 3.8) traits.push('High EQ')
    else traits.push('Self-Aware')
    const relPriority = valuesDim?.subScaleScores?.relationship_priority || 3.0
    if (relPriority >= 4.0) traits.push('Relationship-Focused')
    else traits.push('Balanced')
    return traits.slice(0, 3)
  }, [attachmentStyle, eiDim, valuesDim])

  // Purchase report handler
  const handlePurchaseReport = async () => {
    setPurchasingReport(true)
    try {
      const res = await fetch('/api/reports/self-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.reportId) {
        setReportPurchased(true)
        router.push('/app/self-discovery/report')
      }
    } catch (err) {
      console.error('Failed to purchase report:', err)
    } finally {
      setPurchasingReport(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (dimensions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Brain className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ciq-green)' }} />
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Complete Your Assessments
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Take all 6 assessments to see your Personal Compatibility Profile.
        </p>
        <button
          onClick={() => router.push('/app/assessment')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--ciq-purple)' }}
        >
          Go to Assessments <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Your Compatibility Profile
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {profile?.firstName}, here is what your assessments reveal about you.
        </p>
        <button
          onClick={handleShareProfile}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
          }}
        >
          <Share2 className="w-3.5 h-3.5" /> Share Profile
        </button>
      </div>

      {/* ══════ Dimension Score Rings ══════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {dimensions.map((dim) => {
          const normalized = Math.round((dim.overallScore / 5) * 100)
          const color = DIMENSION_COLORS[dim.dimensionId] || '#7B68B5'
          const circumference = 2 * Math.PI * 36

          return (
            <div key={dim.dimensionId} className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="var(--border)" strokeWidth="5" />
                  <circle
                    cx="40" cy="40" r="36" fill="none"
                    stroke={color} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${(normalized / 100) * circumference} ${circumference}`}
                    transform="rotate(-90 40 40)"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{normalized}</span>
                </div>
              </div>
              <p className="text-[10px] font-medium text-center mt-1.5 leading-tight" style={{ color: 'var(--text-secondary)' }}>
                {dim.dimensionName}
              </p>
            </div>
          )
        })}
      </div>

      {/* ══════ Attachment Style Card (DEEP) ══════ */}
      <SectionCard title="Attachment Style" icon={Heart} color="#5B8DB8">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: '#5B8DB8' }}>
            {ATTACHMENT_LABELS[attachmentStyle] || attachmentStyle}
          </span>
          {(attachmentStyle === 'secure' || attachmentStyle === 'earned_secure') && (
            <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: '#22C55E' }}>
              <CheckCircle2 className="w-3 h-3" /> Strongest foundation
            </span>
          )}
        </div>

        {ATTACHMENT_DEEP_PROFILES[attachmentStyle] && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {ATTACHMENT_DEEP_PROFILES[attachmentStyle].summary}
            </p>

            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: '#5B8DB8' }}>In Relationships</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {ATTACHMENT_DEEP_PROFILES[attachmentStyle].inRelationships}
              </p>
            </div>

            <button
              onClick={() => toggleSection('attachment')}
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: '#5B8DB8' }}
            >
              {expandedSections.attachment ? 'Show Less' : 'See Full Profile'}
              {expandedSections.attachment ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {expandedSections.attachment && (
              <div className="space-y-4 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>What You Need From a Partner</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {ATTACHMENT_DEEP_PROFILES[attachmentStyle].needsFromPartner}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: '#D4A017' }}>
                    <AlertTriangle className="w-3 h-3" /> Growth Edge
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {ATTACHMENT_DEEP_PROFILES[attachmentStyle].growthEdge}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: '#22C55E' }}>Best Match With</p>
                    <ul className="space-y-1">
                      {ATTACHMENT_DEEP_PROFILES[attachmentStyle].bestMatchWith.map((m, i) => (
                        <li key={i} className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>+ {m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--ciq-coral)' }}>Challenges With</p>
                    <ul className="space-y-1">
                      {ATTACHMENT_DEEP_PROFILES[attachmentStyle].challengesWith.map((c, i) => (
                        <li key={i} className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>- {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sub-scale bars */}
        {attachmentDim && (
          <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
            {[
              { label: 'Anxiety', key: 'anxiety', invert: true },
              { label: 'Avoidance', key: 'avoidance', invert: true },
              { label: 'Security', key: 'security', invert: false },
            ].map(({ label, key, invert }) => {
              const raw = attachmentDim.subScaleScores[key] || 3
              const pct = Math.round((raw / 5) * 100)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
                    <span className="text-[11px] font-bold" style={{ color: invert ? (pct > 60 ? 'var(--ciq-coral)' : '#22C55E') : (pct > 60 ? '#22C55E' : 'var(--ciq-coral)') }}>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#5B8DB8' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      {/* ══════ Communication Profile Card (DEEP) ══════ */}
      <SectionCard title="Communication Profile" icon={MessageCircle} color="#D4A017">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: '#D4A017' }}>
            {CONFLICT_LABELS[conflictApproach] || conflictApproach}
          </span>
        </div>

        {CONFLICT_DEEP_PROFILES[conflictApproach] && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {CONFLICT_DEEP_PROFILES[conflictApproach].summary}
            </p>

            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: '#D4A017' }}>When Conflict Arises</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {CONFLICT_DEEP_PROFILES[conflictApproach].inConflict}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#22C55E' }}>Strengths</p>
                <ul className="space-y-1.5">
                  {CONFLICT_DEEP_PROFILES[conflictApproach].strengths.map((s, i) => (
                    <li key={i} className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>+ {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ciq-coral)' }}>Blind Spots</p>
                <ul className="space-y-1.5">
                  {CONFLICT_DEEP_PROFILES[conflictApproach].blindSpots.map((w, i) => (
                    <li key={i} className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>- {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => toggleSection('communication')}
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: '#D4A017' }}
            >
              {expandedSections.communication ? 'Show Less' : 'See Full Profile'}
              {expandedSections.communication ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {expandedSections.communication && (
              <div className="space-y-4 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>How You Repair</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {CONFLICT_DEEP_PROFILES[conflictApproach].repairStyle}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Partner Compatibility</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {CONFLICT_DEEP_PROFILES[conflictApproach].partnerAdvice}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sub-scale bars */}
        {commDim && (
          <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
            {[
              { label: 'Conflict Approach', key: 'conflict_approach' },
              { label: 'Repair Attempts', key: 'repair_attempts' },
              { label: 'Emotional Expression', key: 'emotional_expression' },
            ].map(({ label, key }) => {
              const raw = commDim.subScaleScores[key] || 3
              const pct = Math.round((raw / 5) * 100)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
                    <span className="text-[11px] font-bold" style={{ color: '#D4A017' }}>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#D4A017' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      {/* ══════ Emotional Intelligence Card ══════ */}
      <SectionCard title="Emotional Intelligence" icon={Brain} color="#E8735A">
        <div className="space-y-3">
          {Object.entries(eqBreakdown).map(([label, score]) => {
            const percentage = Math.round((score / 5) * 100)
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
                  <span className="text-xs font-bold" style={{ color: '#E8735A' }}>{percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%`, background: '#E8735A' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        {eiDim && (
          <p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {eiDim.overallScore >= 4.0
              ? 'Your emotional intelligence is a significant relationship asset. You can read emotional cues, regulate your own reactions, and create psychological safety for a partner.'
              : eiDim.overallScore >= 3.0
                ? 'Your EQ is developing well. Focus on the gap between your highest and lowest sub-scales — that\'s where targeted growth will have the biggest impact on your relationships.'
                : 'Emotional intelligence is the most trainable relationship skill. Small daily practices — naming emotions, active listening, pausing before reacting — compound into major relationship improvements.'
            }
          </p>
        )}
      </SectionCard>

      {/* ══════ Values Map - Enhanced Radar Chart ══════ */}
      <SectionCard title="Values Map" icon={Target} color="#7B68B5">
        <ValuesRadarChart
          lifeDirection={valuesDim?.subScaleScores?.life_direction || 3.0}
          moralEthical={valuesDim?.subScaleScores?.moral_ethical || 3.0}
          relationshipPriority={valuesDim?.subScaleScores?.relationship_priority || 3.0}
        />
        {valuesDim && (
          <div className="mt-4 space-y-3">
            {[
              { label: 'Life Direction', key: 'life_direction', desc: 'How aligned your goals, ambitions, and life path are' },
              { label: 'Moral & Ethical', key: 'moral_ethical', desc: 'Your flexibility vs. rigidity on right and wrong' },
              { label: 'Relationship Priority', key: 'relationship_priority', desc: 'How central romantic partnership is to your identity' },
            ].map(({ label, key, desc }) => {
              const raw = valuesDim.subScaleScores[key] || 3
              const pct = Math.round((raw / 5) * 100)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#7B68B5' }}>{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#7B68B5' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      {/* ══════ How You Love ══════ */}
      <SectionCard title="How You Love" icon={Heart} color="#C25B8A">
        <div className="space-y-3">
          {loveLanguageRanking.map((lang, i) => (
            <div key={lang.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {i === 0 && <span className="mr-1 font-bold" style={{ color: '#C25B8A' }}>#{i + 1}</span>}
                  {i > 0 && <span className="mr-1 font-medium" style={{ color: 'var(--text-muted)' }}>#{i + 1}</span>}
                  {lang.label}
                </span>
                <span className="text-xs font-bold" style={{ color: '#C25B8A' }}>{lang.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${lang.percentage}%`,
                    background: i === 0 ? '#C25B8A' : i === 1 ? '#D47FA3' : '#E0A3BC',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {loveLangDim?.loveLangProfile && (
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-semibold mb-1" style={{ color: '#C25B8A' }}>You Receive Love Through</p>
                <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                  {loveLangDim.loveLangProfile.receivingLanguages.map(l => LOVE_STYLE_LABELS[l] || l).join(', ')}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold mb-1" style={{ color: '#C25B8A' }}>You Give Love Through</p>
                <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                  {loveLangDim.loveLangProfile.givingLanguages.map(l => LOVE_STYLE_LABELS[l] || l).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ══════ Dating Readiness Score (ENHANCED) ══════ */}
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: readinessTier.color, background: 'var(--bg-card)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" style={{ color: readinessTier.color }} />
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Dating Readiness Score
          </h3>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg viewBox="0 0 96 96" className="w-full h-full">
              <circle cx="48" cy="48" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle
                cx="48" cy="48" r="42" fill="none"
                stroke={readinessTier.color} strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${(datingReadinessScore / 100) * 263.9} 263.9`}
                transform="rotate(-90 48 48)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: readinessTier.color }}>{datingReadinessScore}</span>
              <span className="text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>of 100</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold mb-1.5" style={{ color: readinessTier.color }}>
              {readinessTier.label}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {readinessTier.desc}
            </p>
          </div>
        </div>

        {/* Readiness breakdown by dimension */}
        <div className="mt-5 pt-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
            Score Breakdown
          </p>
          {dimensions.sort((a, b) => b.overallScore - a.overallScore).map((dim) => {
            const pct = Math.round((dim.overallScore / 5) * 100)
            const color = DIMENSION_COLORS[dim.dimensionId] || '#7B68B5'
            return (
              <div key={dim.dimensionId} className="flex items-center gap-3">
                <span className="text-[11px] font-medium w-32 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {dim.dimensionName}
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="text-[11px] font-bold w-8 text-right" style={{ color }}>{pct}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══════ Upsell: Full Report ══════ */}
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
      >
        <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {reportPurchased ? 'View Your Full Report' : 'Get Your Self-Discovery Report'}
        </h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          {reportPurchased
            ? 'Your detailed personal insight report is ready.'
            : 'A deep-dive into your relationship patterns, growth edges, and dating readiness. Includes actionable insights for every dimension.'
          }
        </p>
        {reportPurchased ? (
          <button
            onClick={() => router.push('/app/self-discovery/report')}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--ciq-green)' }}
          >
            View Report
          </button>
        ) : (
          <button
            onClick={handlePurchaseReport}
            disabled={purchasingReport}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--ciq-purple)' }}
          >
            {purchasingReport ? 'Loading...' : `Get Your Self-Discovery Report — $4.99`}
          </button>
        )}
        {dimensions.length < 6 && !reportPurchased && (
          <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
            Complete all 6 assessments to unlock the full report
          </p>
        )}
      </div>

      {/* ══════ Share CIQ Card ══════ */}
      <div className="text-center">
        <button
          onClick={() => setShowCIQCard(!showCIQCard)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
            background: 'var(--bg-card)',
          }}
        >
          <Share2 className="w-4 h-4" />
          {showCIQCard ? 'Hide' : 'Share'} Your CIQ Card
          {showCIQCard ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {showCIQCard && (
        <CIQCard
          firstName={profile?.firstName || 'You'}
          topTraits={topTraits}
          attachmentStyleLabel={ATTACHMENT_LABELS[attachmentStyle] || 'Secure'}
          primaryLoveLanguage={loveLanguageRanking[0]?.label || 'Quality Time'}
          eqScore={Math.round((eiDim?.overallScore || 3.0) / 5 * 100)}
        />
      )}

      {/* ── Toast Notification ── */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{
            background: 'var(--ciq-purple)',
            animation: 'fadeInUp 0.25s ease-out',
          }}
        >
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            {toast}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  )
}

// ─── Section Card Component ─────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string
  icon: typeof Brain
  color: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ─── Values Radar Chart (SVG) ───────────────────────────

function ValuesRadarChart({
  lifeDirection,
  moralEthical,
  relationshipPriority,
}: {
  lifeDirection: number
  moralEthical: number
  relationshipPriority: number
}) {
  const ld = (lifeDirection - 1) / 4
  const me = (moralEthical - 1) / 4
  const rp = (relationshipPriority - 1) / 4

  const cx = 120, cy = 100, r = 70

  const axes = [
    { label: 'Life Direction', angle: -90, value: ld },
    { label: 'Moral & Ethical', angle: 30, value: me },
    { label: 'Relationship Priority', angle: 150, value: rp },
  ]

  const points = axes.map((axis) => {
    const rad = (axis.angle * Math.PI) / 180
    const dist = axis.value * r
    return {
      x: cx + dist * Math.cos(rad),
      y: cy + dist * Math.sin(rad),
      labelX: cx + (r + 22) * Math.cos(rad),
      labelY: cy + (r + 22) * Math.sin(rad),
      label: axis.label,
      value: Math.round(axis.value * 100),
    }
  })

  const polygon = points.map((p) => `${p.x},${p.y}`).join(' ')
  const rings = [0.25, 0.5, 0.75, 1.0]

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 240 200" className="w-full max-w-[320px]">
        {rings.map((ring) => {
          const ringPoints = axes.map((axis) => {
            const rad = (axis.angle * Math.PI) / 180
            const dist = ring * r
            return `${cx + dist * Math.cos(rad)},${cy + dist * Math.sin(rad)}`
          })
          return (
            <polygon
              key={ring}
              points={ringPoints.join(' ')}
              fill="none"
              stroke="var(--border)"
              strokeWidth="0.5"
              opacity={0.5}
            />
          )
        })}

        {axes.map((axis, i) => {
          const rad = (axis.angle * Math.PI) / 180
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={cx + r * Math.cos(rad)}
              y2={cy + r * Math.sin(rad)}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          )
        })}

        <polygon
          points={polygon}
          fill="rgba(123,104,181,0.2)"
          stroke="#7B68B5"
          strokeWidth="2"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#7B68B5" />
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="text-[8px] font-bold"
              fill="#7B68B5"
            >
              {p.value}%
            </text>
          </g>
        ))}

        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] font-medium"
            fill="var(--text-secondary)"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
