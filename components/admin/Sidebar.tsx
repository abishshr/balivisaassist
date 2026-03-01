'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Instagram,
} from 'lucide-react'

interface SidebarProps {
  userEmail?: string
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Instagram', href: '/admin/instagram', icon: Instagram },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebar-collapsed', String(next))
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const emailInitial = userEmail ? userEmail[0].toUpperCase() : '?'

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-full bg-zinc-950 transition-all duration-200',
          collapsed ? 'w-16' : 'w-56'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-zinc-800/50">
          <Link href="/admin" className="flex items-center gap-3 min-w-0">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              B
            </span>
            {!collapsed && (
              <span className="text-sm font-semibold text-zinc-100 truncate">
                BaliVisaAssist
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                    : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-2 py-3 border-t border-zinc-800/50 space-y-1">
          {!collapsed && userEmail && (
            <div className="flex items-center gap-2.5 px-3 mb-2">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-200">
                {emailInitial}
              </span>
              <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100 transition-colors"
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
          <button
            onClick={toggleCollapsed}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-300 transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? (
              <ChevronsRight className="w-5 h-5 flex-shrink-0" />
            ) : (
              <>
                <ChevronsLeft className="w-5 h-5 flex-shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-950 border-t border-zinc-800 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors relative',
                  isActive
                    ? 'text-emerald-400'
                    : 'text-zinc-500 active:text-zinc-300'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-emerald-400" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
