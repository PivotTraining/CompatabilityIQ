import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { Users, Mail, Brain, TrendingUp, Clock, Sparkles } from 'lucide-react'

async function getStats() {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return null

  const [
    { count: totalUsers },
    { count: waitlistCount },
    { count: assessmentsCompleted },
    { data: recentWaitlist },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('waitlist').select('id', { count: 'exact', head: true }),
    supabase.from('assessment_responses').select('id', { count: 'exact', head: true }),
    supabase.from('waitlist').select('email, first_name, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('display_name, assessment_progress, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  return {
    totalUsers: totalUsers ?? 0,
    waitlistCount: waitlistCount ?? 0,
    assessmentsCompleted: assessmentsCompleted ?? 0,
    recentWaitlist: recentWaitlist ?? [],
    recentUsers: recentUsers ?? [],
  }
}

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
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const moduleLabels = [
    'Values & Priorities',
    'Attachment Style',
    'Communication & Conflict',
    'Emotional Intelligence',
    'Lifestyle & Ambition',
    'How You Love',
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">CompatibleIQ platform at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Registered Users"
          value={stats?.totalUsers ?? '—'}
          sub="All time"
          color="#7B68B5"
        />
        <StatCard
          icon={Mail}
          label="Waitlist Signups"
          value={stats?.waitlistCount ?? '—'}
          sub="Pre-launch"
          color="#E8735A"
        />
        <StatCard
          icon={Brain}
          label="Assessments Submitted"
          value={stats?.assessmentsCompleted ?? '—'}
          sub="All modules"
          color="#4CAF8A"
        />
        <StatCard
          icon={TrendingUp}
          label="Conversion Rate"
          value={
            stats && stats.waitlistCount > 0
              ? `${Math.round((stats.totalUsers / (stats.waitlistCount + stats.totalUsers)) * 100)}%`
              : '—'
          }
          sub="Waitlist → Signup"
          color="#5B8DB8"
        />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Waitlist */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: '#E8735A' }} />
              Recent Waitlist
            </h2>
            <a href="/admin/waitlist" className="text-xs font-medium hover:underline" style={{ color: '#7B68B5' }}>
              View all →
            </a>
          </div>
          {stats?.recentWaitlist.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-400">No waitlist entries yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentWaitlist.map((entry: { email: string; first_name: string | null; created_at: string }) => (
                <div key={entry.email} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{entry.first_name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-400">{entry.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: '#7B68B5' }} />
              Recent Signups
            </h2>
            <a href="/admin/users" className="text-xs font-medium hover:underline" style={{ color: '#7B68B5' }}>
              View all →
            </a>
          </div>
          {stats?.recentUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-400">No users yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentUsers.map((user: { display_name: string | null; assessment_progress: number | null; created_at: string }, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.display_name || 'Unnamed'}</p>
                    <p className="text-xs text-gray-400">
                      Module {user.assessment_progress ?? 0}/6 completed
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assessment Modules Summary */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <Brain className="w-4 h-4" style={{ color: '#4CAF8A' }} />
          Assessment Modules
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleLabels.map((label, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: i < 2 ? '#4CAF8A' : '#7B68B5' }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={
                    i < 2
                      ? { background: '#E8F5E9', color: '#4CAF8A' }
                      : { background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }
                  }
                >
                  {i < 2 ? 'FREE' : 'PAID'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
