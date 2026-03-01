import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/StatsCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatPrice } from '@/lib/utils'
import type { ApplicationStatus } from '@/types/application'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Run all queries in parallel
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    { count: totalApplications },
    { data: statusCounts },
    { count: thisMonthApplications },
    { data: thisMonthPayments },
    { data: recentApplications },
  ] = await Promise.all([
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('status'),
    supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString()),
    supabase
      .from('payments')
      .select('amount')
      .eq('payment_status', 'verified')
      .gte('created_at', startOfMonth.toISOString()),
    supabase
      .from('applications')
      .select(`*, customer:customers (id, first_name, last_name, email, whatsapp_number, nationality)`)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const statusBreakdown =
    statusCounts?.reduce(
      (acc, app: any) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    ) || {}

  const thisMonthRevenue =
    thisMonthPayments?.reduce((sum, p: any) => sum + Number(p.amount), 0) || 0

  const inProgress =
    (statusBreakdown.new || 0) +
    (statusBreakdown.documents_pending || 0) +
    (statusBreakdown.documents_received || 0) +
    (statusBreakdown.under_review || 0) +
    (statusBreakdown.submitted_to_immigration || 0)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          value={totalApplications || 0}
          color="emerald"
          description="All time"
        />
        <StatsCard
          title="This Month"
          value={thisMonthApplications || 0}
          color="blue"
          description="New applications"
        />
        <StatsCard
          title="In Progress"
          value={inProgress}
          color="amber"
          description="Active applications"
        />
        <StatsCard
          title="Revenue (This Month)"
          value={formatPrice(thisMonthRevenue)}
          color="violet"
          description="Verified payments"
        />
      </div>

      {/* Status Breakdown */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-4 lg:p-5">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Applications by Status
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusBreakdown).map(([status, count]) => (
            <div
              key={status}
              className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
            >
              <StatusBadge status={status as ApplicationStatus} />
              <span className="text-sm font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
                {count as number}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-4 lg:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Applications
          </h2>
          <Link
            href="/admin/applications"
            className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!recentApplications || recentApplications.length === 0 ? (
          <p className="text-center py-8 text-zinc-600 dark:text-zinc-400">
            No applications yet
          </p>
        ) : (
          <div className="space-y-1">
            {recentApplications.map((app: any) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold font-mono text-sm text-zinc-900 dark:text-zinc-100">
                      {app.application_number}
                    </p>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                    {app.customer?.first_name} {app.customer?.last_name} &middot;{' '}
                    {app.service_name}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {formatPrice(app.quoted_price)}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
