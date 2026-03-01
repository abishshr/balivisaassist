'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { formatPrice, formatDate } from '@/lib/utils'
import type { ApplicationWithCustomer } from '@/types/application'

interface ApplicationsTableProps {
  applications: ApplicationWithCustomer[]
}

const inputClass =
  'w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none'

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${app.customer.first_name} ${app.customer.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.service_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function getInitials(firstName: string, lastName: string) {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by application #, customer, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputClass} sm:w-48`}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="documents_pending">Documents Pending</option>
          <option value="documents_received">Documents Received</option>
          <option value="under_review">Under Review</option>
          <option value="submitted_to_immigration">Submitted</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-2">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-8 text-sm text-zinc-500 dark:text-zinc-400">
            No applications found
          </div>
        ) : (
          filteredApplications.map((app) => (
            <button
              key={app.id}
              onClick={() => router.push(`/admin/applications/${app.id}`)}
              className="w-full text-left p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors border-l-4 border-l-emerald-500"
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  {getInitials(app.customer.first_name, app.customer.last_name)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {app.application_number}
                    </span>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {app.customer.first_name} {app.customer.last_name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {app.service_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 ml-12">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {formatPrice(app.quoted_price)}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDate(app.created_at, 'short')}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Application #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => router.push(`/admin/applications/${app.id}`)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        {app.application_number}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100">
                        {app.customer.first_name} {app.customer.last_name}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {app.customer.nationality}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100 max-w-xs truncate">
                        {app.service_name}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {formatPrice(app.quoted_price)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        {formatDate(app.created_at, 'short')}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        Showing {filteredApplications.length} of {applications.length} applications
      </div>
    </div>
  )
}
