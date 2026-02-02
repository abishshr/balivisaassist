import { CustomerForm } from '@/components/admin/CustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          New Customer
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Add a new customer to the system
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
        <CustomerForm />
      </div>
    </div>
  )
}
