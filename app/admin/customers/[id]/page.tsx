import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Plus, Pencil } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Application, ApplicationStatus, ApplicationPriority } from '@/types/application'
import type { Customer } from '@/types/customer'

const priorityStyles: Record<ApplicationPriority, string> = {
  low: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300',
  normal: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  high: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  urgent: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

export default async function CustomerDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()

  // Fetch customer
  const { data: customerData, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !customerData) {
    notFound()
  }

  const customer = customerData as unknown as Customer

  // Fetch customer's applications
  const { data: applicationsData } = await supabase
    .from('applications')
    .select('*')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })

  const applications = (applicationsData || []) as unknown as Application[]

  const initials = `${customer.first_name[0] || ''}${customer.last_name[0] || ''}`.toUpperCase()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/admin/customers"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Customers
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-900 dark:text-zinc-100">
              {customer.first_name} {customer.last_name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-base font-semibold text-zinc-600 dark:text-zinc-300">
              {initials}
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {customer.first_name} {customer.last_name}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                Customer since {formatDate(customer.created_at)}
              </p>
            </div>
          </div>
        </div>
        <Link
          href={`/admin/customers/${id}/edit`}
          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Link>
      </div>

      {/* Customer Profile Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoRow label="First Name" value={customer.first_name} />
          <InfoRow label="Last Name" value={customer.last_name} />
          <InfoRow label="Email" value={customer.email || 'Not provided'} />
          <InfoRow label="WhatsApp" value={customer.whatsapp_number} />
          <InfoRow label="Nationality" value={customer.nationality} />
          <InfoRow
            label="Date of Birth"
            value={customer.date_of_birth ? formatDate(customer.date_of_birth) : 'Not provided'}
          />
          <InfoRow
            label="Passport Number"
            value={customer.passport_number || 'Not provided'}
          />
          <InfoRow
            label="Passport Expiry"
            value={customer.passport_expiry ? formatDate(customer.passport_expiry) : 'Not provided'}
          />
          <InfoRow label="Source" value={customer.source} />
          {customer.place_of_birth && (
            <InfoRow label="Place of Birth" value={customer.place_of_birth} />
          )}
          {customer.phone_number && (
            <InfoRow label="Phone Number" value={customer.phone_number} />
          )}
          {customer.notes && (
            <div className="md:col-span-2">
              <InfoRow label="Notes" value={customer.notes} />
            </div>
          )}
        </div>

        {/* Indonesia Address */}
        {(customer.indonesia_address || customer.indonesia_province || customer.indonesia_city || customer.indonesia_postal_code) && (
          <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              Indonesia Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customer.indonesia_residence_type && (
                <InfoRow label="Residence Type" value={customer.indonesia_residence_type} />
              )}
              {customer.indonesia_address && (
                <div className="md:col-span-2">
                  <InfoRow label="Address" value={customer.indonesia_address} />
                </div>
              )}
              {customer.indonesia_province && (
                <InfoRow label="Province" value={customer.indonesia_province} />
              )}
              {customer.indonesia_city && (
                <InfoRow label="City" value={customer.indonesia_city} />
              )}
              {customer.indonesia_postal_code && (
                <InfoRow label="Postal Code" value={customer.indonesia_postal_code} />
              )}
            </div>
          </div>
        )}

      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Applications ({applications?.length || 0})
          </h2>
          <Link
            href="/admin/applications/new"
            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </Link>
        </div>

        {!applications || applications.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4 text-center">
            No applications yet
          </p>
        ) : (
          <div className="space-y-1">
            {applications.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-semibold font-mono text-sm text-zinc-900 dark:text-zinc-100">
                      {app.application_number}
                    </p>
                    <StatusBadge status={app.status as ApplicationStatus} />
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${priorityStyles[app.priority as ApplicationPriority]}`}
                    >
                      {app.priority}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                    {app.service_name}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {formatPrice(app.quoted_price)}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(app.created_at)}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm text-zinc-500 dark:text-zinc-400 w-28 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
    </div>
  )
}
