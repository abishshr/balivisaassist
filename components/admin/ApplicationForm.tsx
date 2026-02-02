'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Customer } from '@/types/customer'
import { services } from '@/data/services'

interface ApplicationFormProps {
  customers: Customer[]
}

export function ApplicationForm({ customers }: ApplicationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
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
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
          No Customers Found
        </h3>
        <p className="text-amber-700 dark:text-amber-300 mb-4">
          You need to create a customer before creating an application.
        </p>
        <button
          onClick={() => router.push('/admin/customers/new')}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
        >
          Create Customer First
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Customer *
          </label>
          <select
            required
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="">Select a customer...</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.first_name} {customer.last_name} ({customer.nationality}) - {customer.whatsapp_number}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Don't see the customer?{' '}
            <button
              type="button"
              onClick={() => router.push('/admin/customers/new')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Create new customer
            </button>
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Service *
          </label>
          <select
            required
            value={formData.service_id}
            onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Quoted Price (IDR) *
          </label>
          <input
            type="number"
            required
            value={formData.quoted_price}
            onChange={(e) => setFormData({ ...formData, quoted_price: e.target.value })}
            placeholder="1500000"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Base price auto-filled from service. Adjust if needed for this customer.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Desired Start Date
          </label>
          <input
            type="date"
            value={formData.desired_start_date}
            onChange={(e) => setFormData({ ...formData, desired_start_date: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Optional: When does the customer want to start the visa process?
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Creating...' : 'Create Application'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
