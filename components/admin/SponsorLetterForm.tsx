'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'

interface SponsorLetterFormProps {
  applicantName: string
  nationality: string
  passportNumber: string
  visaType: string
  dateOfBirth: string
}

const DEFAULT_PURPOSES = [
  'Conducting business exploration activities',
  'Performing feasibility studies and market research',
  'Evaluating potential investment opportunities',
  'Attending business meetings and related discussions',
]

export function SponsorLetterForm({
  applicantName,
  nationality,
  passportNumber,
  visaType,
  dateOfBirth,
}: SponsorLetterFormProps) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setError(null)
    setGenerating(true)

    try {
      const res = await fetch('/api/sponsor-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          nationality,
          passportNumber,
          visaType,
          dateOfBirth,
          letterNumber: '',
          purposes: DEFAULT_PURPOSES,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to generate letter')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Recommendation_Letter_${applicantName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to generate letter. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Recommendation & Invitation Letter for <strong className="text-zinc-900 dark:text-zinc-100">{applicantName}</strong> ({nationality}),
        passport <strong className="text-zinc-900 dark:text-zinc-100">{passportNumber}</strong>, applying for{' '}
        <strong className="text-zinc-900 dark:text-zinc-100">{visaType}</strong>.
        Issued by CIPTA SOLUSI GLOBAL.
      </p>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-md transition-colors"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4" />
            Generate Letter PDF
          </>
        )}
      </button>
    </div>
  )
}
