import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { CustomerForm } from '@/components/admin/CustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-1.5 mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href="/admin/customers"
          className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Customers
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 dark:text-zinc-100">New</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
          New Customer
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Add a new customer to the system
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <CustomerForm />
      </div>
    </div>
  )
}
