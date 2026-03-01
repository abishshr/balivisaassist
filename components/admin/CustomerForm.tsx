'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ScanLine, Loader2, Globe } from 'lucide-react'

interface CustomerFormData {
  first_name: string
  last_name: string
  email: string
  whatsapp_number: string
  nationality: string
  date_of_birth: string
  passport_number: string
  passport_expiry: string
  passport_scan_path: string
  place_of_birth: string
  phone_number: string
  indonesia_residence_type: string
  indonesia_address: string
  indonesia_postal_code: string
  indonesia_province: string
  indonesia_city: string
  notes: string
}

interface CustomerFormProps {
  customerId?: string
  initialData?: Partial<CustomerFormData>
  onSuccess?: (customerId: string) => void
}

const inputClass =
  'w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none'

const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5'

export function CustomerForm({ customerId, initialData, onSuccess }: CustomerFormProps) {
  const router = useRouter()
  const isEditing = !!customerId
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CustomerFormData>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    whatsapp_number: initialData?.whatsapp_number || '',
    nationality: initialData?.nationality || '',
    date_of_birth: initialData?.date_of_birth || '',
    passport_number: initialData?.passport_number || '',
    passport_expiry: initialData?.passport_expiry || '',
    passport_scan_path: initialData?.passport_scan_path || '',
    place_of_birth: initialData?.place_of_birth || '',
    phone_number: initialData?.phone_number || '',
    indonesia_residence_type: initialData?.indonesia_residence_type || '',
    indonesia_address: initialData?.indonesia_address || '',
    indonesia_postal_code: initialData?.indonesia_postal_code || '',
    indonesia_province: initialData?.indonesia_province || '',
    indonesia_city: initialData?.indonesia_city || '',
    notes: initialData?.notes || '',
  })

  // Passport scan state
  const [scanFile, setScanFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleScanPassport() {
    if (!scanFile) return

    setScanning(true)
    setScanMessage(null)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', scanFile)

      const res = await fetch('/api/scan-passport', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan passport')
      }

      const extracted = data.data
      setFormData((prev) => ({
        ...prev,
        ...(extracted.first_name && { first_name: extracted.first_name }),
        ...(extracted.last_name && { last_name: extracted.last_name }),
        ...(extracted.nationality && { nationality: extracted.nationality }),
        ...(extracted.passport_number && { passport_number: extracted.passport_number }),
        ...(extracted.date_of_birth && { date_of_birth: extracted.date_of_birth }),
        ...(extracted.passport_expiry && { passport_expiry: extracted.passport_expiry }),
        ...(extracted.passport_scan_path && { passport_scan_path: extracted.passport_scan_path }),
      }))

      setScanMessage({ type: 'success', text: 'Passport scanned — please verify the extracted information.' })
    } catch (err: any) {
      setScanMessage({ type: 'error', text: err.message })
    } finally {
      setScanning(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/customers', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { ...formData, id: customerId } : formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || (isEditing ? 'Failed to update customer' : 'Failed to create customer'))
      }

      if (onSuccess) {
        onSuccess(data.customer.id)
      } else {
        router.push(`/admin/customers/${data.customer.id}`)
      }
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Passport Scan Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ScanLine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Scan Passport
          </h3>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Optional</span>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-lg p-4 ring-1 ring-zinc-950/5 dark:ring-white/5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            Upload a passport photo to auto-fill the form fields below.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => {
                setScanFile(e.target.files?.[0] || null)
                setScanMessage(null)
              }}
              className="block w-full text-sm text-zinc-500 dark:text-zinc-400
                file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-zinc-300 dark:file:border-zinc-700
                file:text-sm file:font-medium file:bg-white file:text-zinc-700
                dark:file:bg-zinc-800 dark:file:text-zinc-300
                file:cursor-pointer hover:file:bg-zinc-50 dark:hover:file:bg-zinc-700"
            />
            <button
              type="button"
              disabled={!scanFile || scanning}
              onClick={handleScanPassport}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white disabled:text-zinc-500 dark:disabled:text-zinc-400 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              {scanning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {scanning ? 'Scanning...' : 'Scan Passport'}
            </button>
          </div>
          {scanMessage && (
            <div className={`mt-3 text-sm ${
              scanMessage.type === 'success'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {scanMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>First Name *</label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Last Name *</label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>WhatsApp Number *</label>
            <input
              type="tel"
              required
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              placeholder="+62 812 3456 7890"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Nationality *</label>
            <input
              type="text"
              required
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              placeholder="e.g., Australian, American, etc."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Passport Number</label>
            <input
              type="text"
              value={formData.passport_number}
              onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Passport Expiry</label>
            <input
              type="date"
              value={formData.passport_expiry}
              onChange={(e) => setFormData({ ...formData, passport_expiry: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Immigration Portal Details */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Immigration Portal Details
          </h3>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Optional</span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Used to auto-fill the immigration portal when applying for a visa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>Place of Birth</label>
            <input
              type="text"
              value={formData.place_of_birth}
              onChange={(e) => setFormData({ ...formData, place_of_birth: e.target.value })}
              placeholder="e.g. Sydney"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder="+62 812 3456 7890"
              className={inputClass}
            />
          </div>
        </div>

        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
          Indonesia Address
        </p>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Residence Type</label>
            <select
              value={formData.indonesia_residence_type}
              onChange={(e) => setFormData({ ...formData, indonesia_residence_type: e.target.value })}
              className={inputClass}
            >
              <option value="">Select residence type</option>
              <option value="HOME">Home</option>
              <option value="HOTEL">Hotel</option>
              <option value="VILLA">Villa</option>
              <option value="APARTMENT">Apartment</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <textarea
              value={formData.indonesia_address}
              onChange={(e) => setFormData({ ...formData, indonesia_address: e.target.value })}
              rows={2}
              placeholder="Street address in Indonesia"
              className={`${inputClass} resize-vertical`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Province</label>
              <input
                type="text"
                value={formData.indonesia_province}
                onChange={(e) => setFormData({ ...formData, indonesia_province: e.target.value })}
                placeholder="e.g. BALI"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={formData.indonesia_city}
                onChange={(e) => setFormData({ ...formData, indonesia_city: e.target.value })}
                placeholder="e.g. DENPASAR"
                className={inputClass}
              />
            </div>
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Postal Code</label>
            <input
              type="text"
              value={formData.indonesia_postal_code}
              onChange={(e) => setFormData({ ...formData, indonesia_postal_code: e.target.value })}
              placeholder="e.g. 80361"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Notes
        </h3>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className={`${inputClass} resize-vertical`}
          placeholder="Any additional information..."
        />
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
          {loading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Customer')}
        </button>
      </div>
    </form>
  )
}
