import Link from 'next/link'
import { ApplicationsTable } from '@/components/admin/ApplicationsTable'
import type { ApplicationWithCustomer } from '@/types/application'

async function getApplications() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/applications`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return []
  }

  const data = await res.json()
  return data.applications || []
}

export default async function ApplicationsPage() {
  const applications: ApplicationWithCustomer[] = await getApplications()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Applications
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage all visa applications
          </p>
        </div>
        <Link
          href="/admin/applications/new"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          New Application
        </Link>
      </div>

      <ApplicationsTable applications={applications} />
    </div>
  )
}
