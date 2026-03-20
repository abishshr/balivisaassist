'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getServiceBySlug, type Service } from '@/data/services'
import { formatPrice } from '@/lib/utils'
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

const nationalities = [
  'Australian', 'American', 'British', 'Canadian', 'Chinese', 'Dutch', 'French',
  'German', 'Indian', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Korean',
  'Malaysian', 'New Zealander', 'Russian', 'Singaporean', 'South African', 'Swedish',
  'Swiss', 'Thai', 'Other',
]

interface FormData {
  first_name: string
  last_name: string
  email: string
  whatsapp_number: string
  nationality: string
  passport_number: string
}

const initial: FormData = {
  first_name: '',
  last_name: '',
  email: '',
  whatsapp_number: '',
  nationality: '',
  passport_number: '',
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [service, setService] = useState<Service | null>(null)
  const [form, setForm] = useState<FormData>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    const s = getServiceBySlug(slug)
    if (!s) {
      router.replace('/services')
      return
    }
    setService(s)
  }, [slug, router])

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (apiError) setApiError('')
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {}
    if (!form.first_name.trim()) errs.first_name = 'Required'
    if (!form.last_name.trim()) errs.last_name = 'Required'
    if (!form.whatsapp_number.trim()) errs.whatsapp_number = 'Required'
    if (!form.nationality) errs.nationality = 'Required'
    if (!form.passport_number.trim()) errs.passport_number = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !service) return
    setSubmitting(true)
    setApiError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service_slug: slug }),
      })
      const data = await res.json()

      if (!res.ok) {
        setApiError(data.error || 'Something went wrong')
        return
      }

      // Redirect to Xendit payment page
      window.location.href = data.payment_url
    } catch {
      setApiError('Network error. Please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 h-12 border rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] focus:border-transparent transition-all duration-300 ${
      errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
    }`

  const selectClass = (field: keyof FormData) =>
    `w-full px-4 py-3 h-12 border rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] focus:border-transparent transition-all duration-300 ${
      errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
    }`

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href={`/services/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0F4C5C] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {service.name}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Complete Your Application</h1>
              <p className="text-sm text-gray-500 mb-6">Fill in your details to proceed to payment</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={(e) => set('first_name', e.target.value)}
                      placeholder="John"
                      className={inputClass('first_name')}
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.last_name}
                      onChange={(e) => set('last_name', e.target.value)}
                      placeholder="Doe"
                      className={inputClass('last_name')}
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="john@example.com"
                    className={inputClass('email')}
                  />
                  <p className="mt-1 text-xs text-gray-400">Payment receipt will be sent here</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.whatsapp_number}
                    onChange={(e) => set('whatsapp_number', e.target.value)}
                    placeholder="+61 412 345 678"
                    className={inputClass('whatsapp_number')}
                  />
                  {errors.whatsapp_number && <p className="mt-1 text-sm text-red-500">{errors.whatsapp_number}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.nationality}
                    onChange={(e) => set('nationality', e.target.value)}
                    className={selectClass('nationality')}
                  >
                    <option value="">Select nationality</option>
                    {nationalities.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  {errors.nationality && <p className="mt-1 text-sm text-red-500">{errors.nationality}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Passport Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.passport_number}
                    onChange={(e) => set('passport_number', e.target.value.toUpperCase())}
                    placeholder="PA1234567"
                    className={inputClass('passport_number')}
                  />
                  {errors.passport_number && <p className="mt-1 text-sm text-red-500">{errors.passport_number}</p>}
                </div>

                {apiError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {apiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0F4C5C] to-[#1A6B7A] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay {formatPrice(service.startingPrice)}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  You&apos;ll be redirected to our secure payment partner Xendit
                </p>
              </form>
            </div>
          </motion.div>

          {/* Right: Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:sticky lg:top-24">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Service info */}
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.shortDescription}</p>
              </div>

              {/* Details */}
              <div className="py-4 border-b border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Duration: {service.duration}</span>
                </div>
                {service.processingDays && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Processing: {service.processingDays}</span>
                  </div>
                )}
              </div>

              {/* What's included */}
              <div className="py-4 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">What&apos;s Included</p>
                <ul className="space-y-2">
                  {service.benefits.slice(0, 4).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-[#0F4C5C] flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                  {service.benefits.length > 4 && (
                    <li className="text-xs text-gray-400">
                      +{service.benefits.length - 4} more benefits
                    </li>
                  )}
                </ul>
              </div>

              {/* Total */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Service Fee</span>
                  <span className="text-lg font-bold text-gray-900">{formatPrice(service.startingPrice)}</span>
                </div>
                <p className="text-xs text-gray-400">Starting price. Final price may vary based on requirements.</p>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C5C]" />
                  Secure payment via Xendit
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CreditCard className="w-4 h-4 text-[#0F4C5C]" />
                  Credit card, bank transfer, e-wallet & QRIS
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
