import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ApplicationForm } from '@/components/admin/ApplicationForm'
import type { Customer } from '@/types/customer'

export default async function NewApplicationPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  const customers = (data || []) as unknown as Customer[]

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-1.5 mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href="/admin/applications"
          className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Applications
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 dark:text-zinc-100">New</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
          New Application
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Create a new visa application
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <ApplicationForm customers={customers} />
      </div>
    </div>
  )
}
