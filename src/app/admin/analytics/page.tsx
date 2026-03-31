import { BarChart2 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Detailed platform metrics</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
        <BarChart2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500 font-medium">Analytics coming soon</p>
        <p className="text-sm text-gray-400 mt-1">
          Charts for signups, assessments, conversions, and revenue will appear here.
        </p>
      </div>
    </div>
  )
}
