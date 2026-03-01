import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Customer } from '@/types/customer'

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
}

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  const customers = (data || []) as unknown as Customer[]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Customers
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 tabular-nums">
            {customers.length}
          </span>
        </div>
        <Link
          href="/admin/customers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Customer
        </Link>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-2">
        {customers.length === 0 ? (
          <div className="text-center py-8 text-sm text-zinc-500 dark:text-zinc-400">
            No customers yet
          </div>
        ) : (
          customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/admin/customers/${customer.id}`}
              className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {getInitials(customer.first_name, customer.last_name)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {customer.first_name} {customer.last_name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {customer.nationality} &middot; {customer.whatsapp_number}
                </p>
                {customer.passport_number && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Passport: {customer.passport_number}
                  </p>
                )}
              </div>
            </Link>
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
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Nationality
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Passport
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Added
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No customers yet
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="flex items-center gap-3"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-300">
                          {getInitials(customer.first_name, customer.last_name)}
                        </span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {customer.first_name} {customer.last_name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100">
                        {customer.whatsapp_number}
                      </div>
                      {customer.email && (
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {customer.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100">
                        {customer.nationality}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100">
                        {customer.passport_number || '-'}
                      </div>
                      {customer.passport_expiry && (
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          Exp: {new Date(customer.passport_expiry).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
