'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import type { Customer } from '@/types/customer'
import { services } from '@/data/services'

interface ApplicationFormProps {
  customers: Customer[]
}

const inputClass =
  'w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none'

const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5'

export function ApplicationForm({ customers }: ApplicationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    service_id: '',
    service_name: '',
    quoted_price: '',
    priority: 'normal',
    desired_start_date: '',
  })

  // Update service_name and quoted_price when service_id changes
  useEffect(() => {
    if (formData.service_id) {
      const selectedService = services.find((s) => s.id === formData.service_id)
      if (selectedService) {
        setFormData((prev) => ({
          ...prev,
          service_name: selectedService.name,
          quoted_price: selectedService.startingPrice.toString(),
        }))
      }
    }
  }, [formData.service_id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quoted_price: parseFloat(formData.quoted_price),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create application')
      }

      router.push(`/admin/applications/${data.application.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
          <UserPlus className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          No Customers Found
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-sm">
          You need to create a customer before creating an application.
        </p>
        <button
          onClick={() => router.push('/admin/customers/new')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Create Customer First
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={labelClass}>Customer *</label>
          <select
            required
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            className={inputClass}
          >
            <option value="">Select a customer...</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.first_name} {customer.last_name} ({customer.nationality}) - {customer.whatsapp_number}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Don&apos;t see the customer?{' '}
            <button
              type="button"
              onClick={() => router.push('/admin/customers/new')}
              className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 font-medium"
            >
              Create new customer
            </button>
          </p>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Service *</label>
          <select
            required
            value={formData.service_id}
            onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
            className={inputClass}
          >
            <option value="">Select a service...</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - IDR {service.startingPrice.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Quoted Price (IDR) *</label>
          <input
            type="number"
            required
            value={formData.quoted_price}
            onChange={(e) => setFormData({ ...formData, quoted_price: e.target.value })}
            placeholder="1500000"
            className={inputClass}
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Base price auto-filled from service. Adjust if needed for this customer.
          </p>
        </div>

        <div>
          <label className={labelClass}>Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className={inputClass}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Desired Start Date</label>
          <input
            type="date"
            value={formData.desired_start_date}
            onChange={(e) => setFormData({ ...formData, desired_start_date: e.target.value })}
            className={inputClass}
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Optional: When does the customer want to start the visa process?
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? 'Creating...' : 'Create Application'}
        </button>
      </div>
    </form>
  )
}
