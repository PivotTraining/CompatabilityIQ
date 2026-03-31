import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { Users, Brain, Check } from 'lucide-react'

type Profile = {
  id: string
  display_name: string | null
  gender: string | null
  assessment_progress: number | null
  cis_score: number | null
  cis_tier: string | null
  is_active: boolean | null
  created_at: string
}

async function getUsers(): Promise<Profile[]> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('profiles')
    .select('id, display_name, gender, assessment_progress, cis_score, cis_tier, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  return (data ?? []) as Profile[]
}

function ProgressBar({ value, max = 6 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const color = value >= max ? '#4CAF8A' : value >= 2 ? '#7B68B5' : '#E8735A'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{value}/{max}</span>
    </div>
  )
}

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  rare: { bg: '#F3E8FF', color: '#9333EA' },
  synergistic: { bg: '#DCFCE7', color: '#16A34A' },
  compatible: { bg: '#DBEAFE', color: '#2563EB' },
  misaligned: { bg: '#F3F4F6', color: '#6B7280' },
}

export default async function UsersPage() {
  const users = await getUsers()

  const totalCompleted = users.filter((u) => (u.assessment_progress ?? 0) >= 6).length
  const avgProgress =
    users.length > 0
      ? Math.round(users.reduce((sum, u) => sum + (u.assessment_progress ?? 0), 0) / users.length * 10) / 10
      : 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          {users.length} registered • {totalCompleted} fully assessed • avg {avgProgress}/6 modules
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Users</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold" style={{ color: '#4CAF8A' }}>{totalCompleted}</p>
          <p className="text-xs text-gray-500 mt-0.5">Fully Assessed (6/6)</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold" style={{ color: '#7B68B5' }}>{avgProgress}</p>
          <p className="text-xs text-gray-500 mt-0.5">Avg Modules Completed</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No users yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assessment</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">CIS Score</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const tierStyle = user.cis_tier ? TIER_COLORS[user.cis_tier.toLowerCase()] : null
                return (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: '#7B68B5' }}
                        >
                          {(user.display_name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.display_name || 'Unnamed'}</p>
                          <p className="text-xs text-gray-400 capitalize">{user.gender || 'Unknown'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[140px]">
                      <ProgressBar value={user.assessment_progress ?? 0} />
                    </td>
                    <td className="px-6 py-4">
                      {user.cis_score ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.cis_score.toFixed(1)}</p>
                          {tierStyle && (
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                              style={tierStyle}
                            >
                              {user.cis_tier}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={
                          user.is_active
                            ? { background: '#DCFCE7', color: '#16A34A' }
                            : { background: '#F3F4F6', color: '#6B7280' }
                        }
                      >
                        {user.is_active ? <Check className="w-3 h-3" /> : null}
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
