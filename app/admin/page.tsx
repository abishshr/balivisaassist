import Link from 'next/link'
import { StatsCard } from '@/components/admin/StatsCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatPrice } from '@/lib/utils'
import type { ApplicationWithCustomer } from '@/types/application'

async function getStats() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/stats`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function AdminDashboard() {
  const stats = await getStats()

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">
          Unable to load dashboard statistics
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome back! Here's what's happening with your visa applications.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications}
          icon="📋"
          description="All time"
        />
        <StatsCard
          title="This Month"
          value={stats.thisMonthApplications}
          icon="📅"
          description="New applications"
        />
        <StatsCard
          title="In Progress"
          value={
            (stats.statusBreakdown.new || 0) +
            (stats.statusBreakdown.documents_pending || 0) +
            (stats.statusBreakdown.documents_received || 0) +
            (stats.statusBreakdown.under_review || 0) +
            (stats.statusBreakdown.submitted_to_immigration || 0)
          }
          icon="⏳"
          description="Active applications"
        />
        <StatsCard
          title="Revenue (This Month)"
          value={formatPrice(stats.thisMonthRevenue)}
          icon="💰"
          description="Verified payments"
        />
      </div>

      {/* Status Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Applications by Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.statusBreakdown).map(([status, count]) => (
            <div
              key={status}
              className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <StatusBadge status={status as any} />
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {count as number}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recent Applications
          </h2>
          <Link
            href="/admin/applications"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {stats.recentApplications.length === 0 ? (
          <p className="text-center py-8 text-slate-600 dark:text-slate-400">
            No applications yet
          </p>
        ) : (
          <div className="space-y-3">
            {stats.recentApplications.map((app: ApplicationWithCustomer) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {app.application_number}
                    </p>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {app.customer.first_name} {app.customer.last_name} •{' '}
                    {app.service_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {formatPrice(app.quoted_price)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/applications/new"
            className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors group"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                New Application
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Create visa application
              </p>
            </div>
          </Link>

          <Link
            href="/admin/customers/new"
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <span className="text-2xl">👤</span>
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                New Customer
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Add customer profile
              </p>
            </div>
          </Link>

          <Link
            href="/admin/applications"
            className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors group"
          >
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                View Applications
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Browse all applications
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
