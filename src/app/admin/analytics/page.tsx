import { getSupabaseServiceClient } from '@/lib/supabase/server'
import {
  Users,
  Brain,
  Heart,
  DollarSign,
  MessageCircle,
  TrendingUp,
  Activity,
  Clock,
  UserPlus,
  CreditCard,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────

interface DailySignup {
  date: string
  count: number
}

interface FunnelStep {
  label: string
  count: number
  pct: number
}

interface RevenueByProduct {
  product_type: string
  total_cents: number
}

interface ActivityItem {
  type: 'signup' | 'match' | 'payment'
  label: string
  sub: string
  time: string
}

interface AnalyticsData {
  totalUsers: number
  usersLastWeek: number
  usersPrevWeek: number
  totalAssessments: number
  totalMatches: number
  totalRevenueCents: number
  dailySignups: DailySignup[]
  funnel: FunnelStep[]
  revenueByProduct: RevenueByProduct[]
  activeUsers: number
  usersWithMatch: number
  matchesWithMessage: number
  totalMatchesForRate: number
  avgMessagesPerMatch: number
  recentActivity: ActivityItem[]
}

// ─── Data fetching ───────────────────────────────────────────────────

async function getAnalytics(): Promise<AnalyticsData | null> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return null

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Row 1 queries
  const [
    { count: totalUsers },
    { data: usersLastWeekData },
    { data: usersPrevWeekData },
    { count: totalAssessments },
    { count: totalMatches },
    { data: paymentsData },
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id').gte('created_at', sevenDaysAgo),
    supabase
      .from('profiles')
      .select('id')
      .gte('created_at', fourteenDaysAgo)
      .lt('created_at', sevenDaysAgo),
    supabase.from('assessment_responses').select('id', { count: 'exact', head: true }),
    supabase.from('matches').select('id', { count: 'exact', head: true }),
    supabase.from('payments').select('amount_cents, product_type, status').eq('status', 'succeeded'),
  ])

  const totalRevenueCents = (paymentsData ?? []).reduce(
    (sum: number, p: { amount_cents: number }) => sum + p.amount_cents,
    0
  )

  // Row 2: daily signups last 30 days
  const { data: signupRows } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: true })

  const dailyMap = new Map<string, number>()
  // Pre-fill all 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    dailyMap.set(d.toISOString().slice(0, 10), 0)
  }
  for (const row of signupRows ?? []) {
    const day = (row as { created_at: string }).created_at.slice(0, 10)
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1)
  }
  const dailySignups: DailySignup[] = Array.from(dailyMap.entries()).map(([date, count]) => ({
    date,
    count,
  }))

  // Row 3: Assessment funnel
  // Count distinct dimension_ids per user via assessment_responses
  const { data: assessmentRows } = await supabase
    .from('assessment_responses')
    .select('user_id, dimension_id')

  const userDimensions = new Map<string, Set<string>>()
  for (const row of (assessmentRows ?? []) as { user_id: string; dimension_id: string }[]) {
    if (!userDimensions.has(row.user_id)) userDimensions.set(row.user_id, new Set())
    userDimensions.get(row.user_id)!.add(row.dimension_id)
  }

  const dimensionLabels = [
    'Values & Priorities',
    'Attachment Style',
    'Communication',
    'Emotional Intelligence',
    'Lifestyle & Ambition',
    'How You Connect',
  ]

  const signedUpCount = totalUsers ?? 0
  const moduleCounts = Array.from({ length: 6 }, (_, i) => {
    let count = 0
    userDimensions.forEach((dims) => {
      if (dims.size >= i + 1) count++
    })
    return count
  })

  const funnelSteps: FunnelStep[] = [
    { label: 'Signed Up', count: signedUpCount, pct: 100 },
    ...dimensionLabels.map((label, i) => ({
      label: `Module ${i + 1}`,
      count: moduleCounts[i],
      pct: signedUpCount > 0 ? Math.round((moduleCounts[i] / signedUpCount) * 100) : 0,
    })),
  ]

  // Row 4: Revenue by product
  const revenueMap = new Map<string, number>()
  for (const p of (paymentsData ?? []) as { amount_cents: number; product_type: string }[]) {
    revenueMap.set(p.product_type, (revenueMap.get(p.product_type) ?? 0) + p.amount_cents)
  }
  const revenueByProduct: RevenueByProduct[] = Array.from(revenueMap.entries()).map(
    ([product_type, total_cents]) => ({ product_type, total_cents })
  )

  // Row 5: Engagement
  // Active users = distinct senders in messages in last 7 days
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('sender_id, match_id')
    .gte('created_at', sevenDaysAgo)

  const activeSenders = new Set<string>()
  for (const m of (recentMessages ?? []) as { sender_id: string }[]) {
    activeSenders.add(m.sender_id)
  }

  // Users with at least 1 match
  const { data: matchRows } = await supabase
    .from('matches')
    .select('user_a_id, user_b_id')
    .eq('status', 'active')

  const usersInMatches = new Set<string>()
  for (const m of (matchRows ?? []) as { user_a_id: string; user_b_id: string }[]) {
    usersInMatches.add(m.user_a_id)
    usersInMatches.add(m.user_b_id)
  }

  // Matches with at least 1 message
  const { data: allMessages } = await supabase.from('messages').select('match_id')
  const matchesWithMsg = new Set<string>()
  for (const m of (allMessages ?? []) as { match_id: string }[]) {
    matchesWithMsg.add(m.match_id)
  }

  // Avg messages per match
  const msgCountMap = new Map<string, number>()
  for (const m of (allMessages ?? []) as { match_id: string }[]) {
    msgCountMap.set(m.match_id, (msgCountMap.get(m.match_id) ?? 0) + 1)
  }
  const matchCounts = Array.from(msgCountMap.values())
  const avgMsgs = matchCounts.length > 0
    ? Math.round(matchCounts.reduce((a, b) => a + b, 0) / matchCounts.length)
    : 0

  // Row 6: Recent activity
  const [
    { data: recentSignups },
    { data: recentMatches },
    { data: recentPayments },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('first_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('matches')
      .select('user_a_id, user_b_id, matched_at, cis_score')
      .order('matched_at', { ascending: false })
      .limit(10),
    supabase
      .from('payments')
      .select('product_type, amount_cents, created_at, status')
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const activity: ActivityItem[] = []

  for (const s of (recentSignups ?? []) as { first_name: string; created_at: string }[]) {
    activity.push({
      type: 'signup',
      label: s.first_name || 'New User',
      sub: 'signed up',
      time: s.created_at,
    })
  }
  for (const m of (recentMatches ?? []) as {
    user_a_id: string
    user_b_id: string
    matched_at: string
    cis_score: number | null
  }[]) {
    activity.push({
      type: 'match',
      label: `Match created`,
      sub: m.cis_score ? `CIS: ${Math.round(m.cis_score)}%` : 'CIS pending',
      time: m.matched_at,
    })
  }
  for (const p of (recentPayments ?? []) as {
    product_type: string
    amount_cents: number
    created_at: string
  }[]) {
    activity.push({
      type: 'payment',
      label: formatProductType(p.product_type),
      sub: `$${(p.amount_cents / 100).toFixed(2)}`,
      time: p.created_at,
    })
  }

  activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return {
    totalUsers: totalUsers ?? 0,
    usersLastWeek: usersLastWeekData?.length ?? 0,
    usersPrevWeek: usersPrevWeekData?.length ?? 0,
    totalAssessments: totalAssessments ?? 0,
    totalMatches: totalMatches ?? 0,
    totalRevenueCents,
    dailySignups,
    funnel: funnelSteps,
    revenueByProduct,
    activeUsers: activeSenders.size,
    usersWithMatch: usersInMatches.size,
    matchesWithMessage: matchesWithMsg.size,
    totalMatchesForRate: matchRows?.length ?? 0,
    avgMessagesPerMatch: avgMsgs,
    recentActivity: activity.slice(0, 10),
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatProductType(pt: string): string {
  const map: Record<string, string> = {
    resonance_report: 'Resonance Report',
    self_discovery_report: 'Self-Discovery Report',
    ciq_pro: 'CIQ Pro',
    founding_member: 'Founding Member',
  }
  return map[pt] ?? pt
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function pctChange(current: number, previous: number): { value: string; positive: boolean } {
  if (previous === 0) {
    return current > 0 ? { value: '+100%', positive: true } : { value: '0%', positive: true }
  }
  const change = Math.round(((current - previous) / previous) * 100)
  return {
    value: `${change >= 0 ? '+' : ''}${change}%`,
    positive: change >= 0,
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// ─── Components ──────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        {sub && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: sub.startsWith('+') || sub === '0%' ? '#E8F5E9' : '#FBE9E7',
              color: sub.startsWith('+') || sub === '0%' ? '#2E7D32' : '#C62828',
            }}
          >
            {sub}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  )
}

function SignupChart({ data }: { data: DailySignup[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const chartHeight = 160
  const barWidth = 100 / data.length

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" style={{ color: '#7B68B5' }} />
        Signup Trend
      </h2>
      <p className="text-xs text-gray-400 mb-5">Last 30 days</p>

      <div className="relative" style={{ height: chartHeight + 32 }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <div
            key={pct}
            className="absolute left-0 right-0 border-t border-gray-100"
            style={{ top: `${(1 - pct) * chartHeight}px` }}
          >
            <span className="absolute -left-0 -top-2.5 text-[10px] text-gray-300 hidden sm:block">
              {Math.round(maxCount * pct)}
            </span>
          </div>
        ))}

        {/* Bars */}
        <svg
          viewBox={`0 0 ${data.length * 10} ${chartHeight}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full"
          style={{ height: chartHeight }}
        >
          {data.map((d, i) => {
            const barH = (d.count / maxCount) * chartHeight
            return (
              <rect
                key={d.date}
                x={i * 10 + 1}
                y={chartHeight - barH}
                width={8}
                height={barH}
                rx={2}
                fill={d.count > 0 ? '#7B68B5' : '#E5E7EB'}
                opacity={d.count > 0 ? 0.85 : 0.4}
              />
            )
          })}
        </svg>

        {/* X-axis labels */}
        <div
          className="absolute left-0 right-0 flex justify-between"
          style={{ top: chartHeight + 8 }}
        >
          <span className="text-[10px] text-gray-400">{data[0]?.date.slice(5)}</span>
          <span className="text-[10px] text-gray-400">
            {data[Math.floor(data.length / 2)]?.date.slice(5)}
          </span>
          <span className="text-[10px] text-gray-400">
            {data[data.length - 1]?.date.slice(5)}
          </span>
        </div>
      </div>
    </div>
  )
}

function AssessmentFunnel({ steps }: { steps: FunnelStep[] }) {
  const maxCount = steps[0]?.count ?? 1

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <Brain className="w-4 h-4" style={{ color: '#4CAF8A' }} />
        Assessment Funnel
      </h2>
      <p className="text-xs text-gray-400 mb-5">Signed Up through All 6 Modules</p>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const widthPct = maxCount > 0 ? Math.max((step.count / maxCount) * 100, 4) : 4
          const conversionFromPrev =
            i > 0 && steps[i - 1].count > 0
              ? Math.round((step.count / steps[i - 1].count) * 100)
              : null

          return (
            <div key={step.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{step.label}</span>
                  {conversionFromPrev !== null && (
                    <span className="text-[10px] text-gray-400">
                      ({conversionFromPrev}% from prev)
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-900">{step.count}</span>
              </div>
              <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all"
                  style={{
                    width: `${widthPct}%`,
                    background:
                      i === 0
                        ? '#7B68B5'
                        : `hsl(${150 + i * 15}, 50%, ${45 + i * 3}%)`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RevenueBreakdown({ products }: { products: RevenueByProduct[] }) {
  const maxCents = Math.max(...products.map((p) => p.total_cents), 1)

  const colorMap: Record<string, string> = {
    resonance_report: '#7B68B5',
    self_discovery_report: '#5B8DB8',
    ciq_pro: '#E8735A',
    founding_member: '#4CAF8A',
  }

  // Show all product types, even with $0
  const allProducts = ['resonance_report', 'self_discovery_report', 'ciq_pro', 'founding_member']
  const display = allProducts.map((pt) => {
    const found = products.find((p) => p.product_type === pt)
    return {
      product_type: pt,
      total_cents: found?.total_cents ?? 0,
    }
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <DollarSign className="w-4 h-4" style={{ color: '#4CAF8A' }} />
        Revenue Breakdown
      </h2>
      <p className="text-xs text-gray-400 mb-5">By product type (succeeded payments)</p>

      <div className="space-y-4">
        {display.map((p) => {
          const widthPct = maxCents > 0 ? Math.max((p.total_cents / maxCents) * 100, 2) : 2
          return (
            <div key={p.product_type}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">
                  {formatProductType(p.product_type)}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(p.total_cents)}
                </span>
              </div>
              <div className="h-5 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg"
                  style={{
                    width: `${widthPct}%`,
                    background: colorMap[p.product_type] ?? '#94a3b8',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EngagementMetrics({
  activeUsers,
  totalUsers,
  usersWithMatch,
  matchesWithMessage,
  totalMatches,
  avgMessagesPerMatch,
}: {
  activeUsers: number
  totalUsers: number
  usersWithMatch: number
  matchesWithMessage: number
  totalMatches: number
  avgMessagesPerMatch: number
}) {
  const matchRate = totalUsers > 0 ? Math.round((usersWithMatch / totalUsers) * 100) : 0
  const messageRate = totalMatches > 0 ? Math.round((matchesWithMessage / totalMatches) * 100) : 0

  const metrics = [
    {
      icon: Activity,
      label: 'Active Users (7d)',
      value: activeUsers,
      color: '#7B68B5',
    },
    {
      icon: Heart,
      label: 'Match Rate',
      value: `${matchRate}%`,
      color: '#E8735A',
    },
    {
      icon: MessageCircle,
      label: 'Message Rate',
      value: `${messageRate}%`,
      color: '#5B8DB8',
    },
    {
      icon: MessageCircle,
      label: 'Avg Msgs/Match',
      value: avgMessagesPerMatch,
      color: '#4CAF8A',
    },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <Activity className="w-4 h-4" style={{ color: '#7B68B5' }} />
        Engagement
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3"
              style={{ background: `${m.color}15`, color: m.color }}
            >
              <m.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentActivityFeed({ items }: { items: ActivityItem[] }) {
  const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
    signup: { icon: UserPlus, color: '#7B68B5' },
    match: { icon: Heart, color: '#E8735A' },
    payment: { icon: CreditCard, color: '#4CAF8A' },
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <Clock className="w-4 h-4" style={{ color: '#5B8DB8' }} />
        Recent Activity
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-1">
          {items.map((item, i) => {
            const { icon: ItemIcon, color } = iconMap[item.type] ?? {
              icon: Activity,
              color: '#94a3b8',
            }
            return (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, color }}
                >
                  <ItemIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(item.time)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  const data = await getAnalytics()

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Unable to connect to database.</p>
      </div>
    )
  }

  const weekChange = pctChange(data.usersLastWeek, data.usersPrevWeek)

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Detailed platform metrics</p>
      </div>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={data.totalUsers.toLocaleString()}
          sub={weekChange.value}
          color="#7B68B5"
        />
        <StatCard
          icon={Brain}
          label="Assessments Completed"
          value={data.totalAssessments.toLocaleString()}
          color="#4CAF8A"
        />
        <StatCard
          icon={Heart}
          label="Matches Created"
          value={data.totalMatches.toLocaleString()}
          color="#E8735A"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(data.totalRevenueCents)}
          color="#5B8DB8"
        />
      </div>

      {/* Row 2: Signup Trend */}
      <div className="mb-6">
        <SignupChart data={data.dailySignups} />
      </div>

      {/* Row 3 & 4: Funnel + Revenue side by side */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <AssessmentFunnel steps={data.funnel} />
        <RevenueBreakdown products={data.revenueByProduct} />
      </div>

      {/* Row 5: Engagement */}
      <div className="mb-6">
        <EngagementMetrics
          activeUsers={data.activeUsers}
          totalUsers={data.totalUsers}
          usersWithMatch={data.usersWithMatch}
          matchesWithMessage={data.matchesWithMessage}
          totalMatches={data.totalMatchesForRate}
          avgMessagesPerMatch={data.avgMessagesPerMatch}
        />
      </div>

      {/* Row 6: Recent Activity */}
      <RecentActivityFeed items={data.recentActivity} />
    </div>
  )
}
