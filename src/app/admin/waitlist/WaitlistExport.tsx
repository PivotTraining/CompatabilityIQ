'use client'

import { Download } from 'lucide-react'

type Entry = {
  id: string
  email: string
  first_name: string | null
  source: string | null
  created_at: string
}

export default function WaitlistExport({ entries }: { entries: Entry[] }) {
  const handleExport = () => {
    const header = 'First Name,Email,Source,Signed Up'
    const rows = entries.map((e) =>
      [
        e.first_name || '',
        e.email,
        e.source || 'homepage',
        new Date(e.created_at).toISOString(),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ciq-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (entries.length === 0) return null

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  )
}
