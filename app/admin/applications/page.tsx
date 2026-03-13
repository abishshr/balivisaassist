import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ApplicationsTable } from '@/components/admin/ApplicationsTable'
import type { ApplicationWithCustomer } from '@/types/application'

export default async function ApplicationsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('applications')
    .select(`*, customer:customers (id, first_name, last_name, email, whatsapp_number, nationality)`)
    .order('created_at', { ascending: false })

  const applications = (data || []) as unknown as ApplicationWithCustomer[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Applications
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 tabular-nums">
            {applications.length}
          </span>
        </div>
        {/* Desktop button */}
        <Link
          href="/admin/applications/new"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Application
        </Link>
        {/* Mobile button */}
        <Link
          href="/admin/applications/new"
          className="sm:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New
        </Link>
      </div>

      <ApplicationsTable applications={applications} />
    </div>
  )
}
