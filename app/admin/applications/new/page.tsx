import { ApplicationForm } from '@/components/admin/ApplicationForm'
import type { Customer } from '@/types/customer'

async function getCustomers() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/customers`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return []
  }

  const data = await res.json()
  return data.customers || []
}

export default async function NewApplicationPage() {
  const customers: Customer[] = await getCustomers()

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          New Application
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Create a new visa application
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
        <ApplicationForm customers={customers} />
      </div>
    </div>
  )
}
