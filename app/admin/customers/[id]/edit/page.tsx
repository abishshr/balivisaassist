import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CustomerForm } from '@/components/admin/CustomerForm'
import type { Customer } from '@/types/customer'

export default async function EditCustomerPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()

  const { data: customerData, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !customerData) {
    notFound()
  }

  const customer = customerData as unknown as Customer

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-1.5 mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/admin/customers"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Customers
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/admin/customers/${id}`}
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            {customer.first_name} {customer.last_name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-900 dark:text-zinc-100">Edit</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Edit Customer
        </h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <CustomerForm
          customerId={id}
          initialData={{
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email || '',
            whatsapp_number: customer.whatsapp_number,
            nationality: customer.nationality,
            date_of_birth: customer.date_of_birth || '',
            passport_number: customer.passport_number || '',
            passport_expiry: customer.passport_expiry || '',
            passport_scan_path: customer.passport_scan_path || '',
            place_of_birth: customer.place_of_birth || '',
            phone_number: customer.phone_number || '',
            indonesia_residence_type: customer.indonesia_residence_type || '',
            indonesia_address: customer.indonesia_address || '',
            indonesia_postal_code: customer.indonesia_postal_code || '',
            indonesia_province: customer.indonesia_province || '',
            indonesia_city: customer.indonesia_city || '',
            notes: customer.notes || '',
          }}
        />
      </div>
    </div>
  )
}
