'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { services } from '@/data/services'
import { COMPANY } from '@/constants/company'
import {
  User,
  BookOpen,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MessageCircle,
} from 'lucide-react'

const steps = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Passport Details', icon: BookOpen },
  { id: 3, label: 'Indonesia Address', icon: MapPin },
]

const nationalities = [
  'Australian', 'American', 'British', 'Canadian', 'Chinese', 'Dutch', 'French',
  'German', 'Indian', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Korean',
  'Malaysian', 'New Zealander', 'Russian', 'Singaporean', 'South African', 'Swedish',
  'Swiss', 'Thai', 'Other',
]

const provinces = [
  'Bali', 'DKI Jakarta', 'West Java', 'Central Java', 'East Java',
  'West Nusa Tenggara', 'East Nusa Tenggara', 'Other',
]

const residenceTypes = [
  { value: 'villa', label: 'Villa / House' },
  { value: 'apartment', label: 'Apartment / Kos' },
  { value: 'hotel', label: 'Hotel / Guesthouse' },
  { value: 'other', label: 'Other' },
]

interface FormData {
  first_name: string
  last_name: string
  email: string
  whatsapp_number: string
  nationality: string
  date_of_birth: string
  place_of_birth: string
  passport_number: string
  passport_expiry: string
  indonesia_address: string
  indonesia_city: string
  indonesia_province: string
  indonesia_postal_code: string
  indonesia_residence_type: string
  service_interest: string
}

const initial: FormData = {
  first_name: '',
  last_name: '',
  email: '',
  whatsapp_number: '',
  nationality: '',
  date_of_birth: '',
  place_of_birth: '',
  passport_number: '',
  passport_expiry: '',
  indonesia_address: '',
  indonesia_city: '',
  indonesia_province: 'Bali',
  indonesia_postal_code: '',
  indonesia_residence_type: '',
  service_interest: '',
}

export default function OnboardPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [apiError, setApiError] = useState('')

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (apiError) setApiError('')
  }

  const validateStep = (s: number): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {}

    if (s === 1) {
      if (!form.first_name.trim()) errs.first_name = 'First name is required'
      if (!form.last_name.trim()) errs.last_name = 'Last name is required'
      if (!form.whatsapp_number.trim()) errs.whatsapp_number = 'WhatsApp number is required'
      if (!form.nationality) errs.nationality = 'Please select your nationality'
    }

    if (s === 2) {
      if (!form.passport_number.trim()) errs.passport_number = 'Passport number is required'
      if (!form.passport_expiry) errs.passport_expiry = 'Passport expiry date is required'
      if (form.passport_expiry) {
        const expiry = new Date(form.passport_expiry)
        const sixMonths = new Date()
        sixMonths.setMonth(sixMonths.getMonth() + 6)
        if (expiry < sixMonths) {
          errs.passport_expiry = 'Passport must be valid for at least 6 months'
        }
      }
    }

    if (s === 3) {
      if (!form.indonesia_address.trim()) errs.indonesia_address = 'Address is required'
      if (!form.indonesia_city.trim()) errs.indonesia_city = 'City is required'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 3))
  }

  const prev = () => setStep((s) => Math.max(s - 1, 1))

  const submit = async () => {
    if (!validateStep(step)) return
    setSubmitting(true)
    setApiError('')

    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setApiError(data.error || 'Something went wrong')
        return
      }

      setDone(true)
    } catch {
      setApiError('Network error. Please check your connection and try again.')
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

  const labelClass = 'block text-sm font-semibold text-gray-900 mb-2'

  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent('Hi, I just completed the onboarding form. I\'d like to get started with my visa process.')}`

  // Success state
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            You&apos;re All Set!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you, {form.first_name}! We&apos;ve received your information. Our team will
            review your details and reach out to you on WhatsApp shortly to get your
            visa process started.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0F4C5C] to-[#1A6B7A] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
            Chat with Us on WhatsApp
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Get Started
          </h1>
          <p className="text-gray-500 text-base">
            Fill in your details so we can begin your visa process
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {steps.map((s, i) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isComplete = step > s.id
            return (
              <React.Fragment key={s.id}>
                {i > 0 && (
                  <div
                    className={`hidden sm:block w-12 h-0.5 transition-colors duration-300 ${
                      isComplete ? 'bg-[#0F4C5C]' : 'bg-gray-200'
                    }`}
                  />
                )}
                <button
                  onClick={() => {
                    if (isComplete) setStep(s.id)
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0F4C5C] text-white shadow-md'
                      : isComplete
                        ? 'bg-[#0F4C5C]/10 text-[#0F4C5C] cursor-pointer hover:bg-[#0F4C5C]/20'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.id}</span>
                </button>
              </React.Fragment>
            )
          })}
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Your basic contact details</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
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
                    <label className={labelClass}>
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
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="john@example.com"
                    className={inputClass('email')}
                  />
                </div>

                <div>
                  <label className={labelClass}>
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
                  <label className={labelClass}>
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
                  <label className={labelClass}>Service You&apos;re Interested In</label>
                  <select
                    value={form.service_interest}
                    onChange={(e) => set('service_interest', e.target.value)}
                    className={selectClass('service_interest')}
                  >
                    <option value="">Select a service (optional)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 2: Passport */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Passport Details</h2>
                  <p className="text-sm text-gray-500 mt-1">As shown on your passport</p>
                </div>

                <div>
                  <label className={labelClass}>
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

                <div>
                  <label className={labelClass}>
                    Passport Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.passport_expiry}
                    onChange={(e) => set('passport_expiry', e.target.value)}
                    className={inputClass('passport_expiry')}
                  />
                  {errors.passport_expiry && <p className="mt-1 text-sm text-red-500">{errors.passport_expiry}</p>}
                </div>

                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => set('date_of_birth', e.target.value)}
                    className={inputClass('date_of_birth')}
                  />
                </div>

                <div>
                  <label className={labelClass}>Place of Birth</label>
                  <input
                    type="text"
                    value={form.place_of_birth}
                    onChange={(e) => set('place_of_birth', e.target.value)}
                    placeholder="Sydney, Australia"
                    className={inputClass('place_of_birth')}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Indonesia Address */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Indonesia Address</h2>
                  <p className="text-sm text-gray-500 mt-1">Your current or planned address in Indonesia</p>
                </div>

                <div>
                  <label className={labelClass}>Accommodation Type</label>
                  <select
                    value={form.indonesia_residence_type}
                    onChange={(e) => set('indonesia_residence_type', e.target.value)}
                    className={selectClass('indonesia_residence_type')}
                  >
                    <option value="">Select type</option>
                    {residenceTypes.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.indonesia_address}
                    onChange={(e) => set('indonesia_address', e.target.value)}
                    placeholder="Jl. Pantai Batu Bolong No. 38"
                    className={inputClass('indonesia_address')}
                  />
                  {errors.indonesia_address && <p className="mt-1 text-sm text-red-500">{errors.indonesia_address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.indonesia_city}
                      onChange={(e) => set('indonesia_city', e.target.value)}
                      placeholder="Denpasar"
                      className={inputClass('indonesia_city')}
                    />
                    {errors.indonesia_city && <p className="mt-1 text-sm text-red-500">{errors.indonesia_city}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Province</label>
                    <select
                      value={form.indonesia_province}
                      onChange={(e) => set('indonesia_province', e.target.value)}
                      className={selectClass('indonesia_province')}
                    >
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Postal Code</label>
                  <input
                    type="text"
                    value={form.indonesia_postal_code}
                    onChange={(e) => set('indonesia_postal_code', e.target.value)}
                    placeholder="80361"
                    className={inputClass('indonesia_postal_code')}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* API error */}
          {apiError && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {apiError}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                onClick={prev}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={next}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0F4C5C] to-[#1A6B7A] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0F4C5C] to-[#1A6B7A] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Trust note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Your information is securely stored and only used for visa processing purposes.
        </p>
      </div>
    </div>
  )
}
