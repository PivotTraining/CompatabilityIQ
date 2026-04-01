'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Mail, Users, BarChart2, BadgeCheck, ImageIcon, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/waitlist', icon: Mail, label: 'Waitlist' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/photos', icon: ImageIcon, label: 'Photos' },
  { href: '/admin/verification', icon: BadgeCheck, label: 'Verification' },
  { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-60 min-h-screen flex flex-col border-r"
      style={{ background: '#1A1730', borderColor: '#2D2850' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: '#2D2850' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'var(--ciq-purple)' }}
          >
            C
          </div>
          <div>
            <p className="text-white font-semibold text-sm">CompatibleIQ</p>
            <p className="text-xs" style={{ color: '#8B85A8' }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? 'rgba(123,104,181,0.2)' : 'transparent',
                color: isActive ? '#C4BADE' : '#8B85A8',
              }}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t" style={{ borderColor: '#2D2850' }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
          style={{ color: '#8B85A8' }}
        >
          <LogOut style={{ width: 18, height: 18 }} />
          Back to Site
        </Link>
      </div>
    </aside>
  )
}
