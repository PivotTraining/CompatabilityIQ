import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { Mail, Download } from 'lucide-react'
import WaitlistExport from './WaitlistExport'

type WaitlistEntry = {
  id: string
  email: string
  first_name: string | null
  source: string | null
  created_at: string
}

async function getWaitlist(): Promise<WaitlistEntry[]> {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('waitlist')
    .select('id, email, first_name, source, created_at')
    .order('created_at', { ascending: false })

  return (data ?? []) as WaitlistEntry[]
}

export default async function WaitlistPage() {
  const entries = await getWaitlist()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waitlist</h1>
          <p className="text-sm text-gray-500 mt-1">{entries.length} people waiting for launch</p>
        </div>
        <WaitlistExport entries={entries} />
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <Mail className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No waitlist entries yet</p>
          <p className="text-sm text-gray-400 mt-1">Entries will appear here once people sign up from the home page.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{entry.first_name || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${entry.email}`} className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                      {entry.email}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                      {entry.source || 'homepage'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
