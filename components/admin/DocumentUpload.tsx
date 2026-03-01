'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { Upload, FileText, Trash2, Merge } from 'lucide-react'
import type { Document, DocumentType } from '@/types/application'

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: 'Passport',
  passport_photo: 'Passport Photo',
  flight_ticket: 'Flight Ticket',
  accommodation_proof: 'Accommodation Proof',
  sponsorship_letter: 'Sponsorship Letter',
  proof_of_payment: 'Proof of Payment',
  bank_statement: 'Bank Statement',
  invitation_letter: 'Invitation Letter',
  other: 'Other',
}

const SERVICE_DOCUMENT_TYPES: Record<string, DocumentType[]> = {
  'd12-visa-1year': ['passport', 'passport_photo', 'bank_statement', 'other'],
  'd12-visa-2year': ['passport', 'passport_photo', 'bank_statement', 'other'],
}

const STATUS_STYLES: Record<string, string> = {
  received: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  verified: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  rejected: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

const inputClass =
  'w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none'

interface DocumentUploadProps {
  applicationId: string
  serviceId: string
  initialDocuments: Document[]
  passportScanUrl?: string | null
  documentUrls?: Record<string, string>
}

export function DocumentUpload({ applicationId, serviceId, initialDocuments, passportScanUrl, documentUrls = {} }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [uploading, setUploading] = useState(false)
  const [merging, setMerging] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const documentTypes = SERVICE_DOCUMENT_TYPES[serviceId] || (Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[])
  const [selectedType, setSelectedType] = useState<DocumentType>(documentTypes[0])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const bankStatementPdfCount = useMemo(
    () => documents.filter((d) => d.type === 'bank_statement' && d.mime_type === 'application/pdf').length,
    [documents]
  )

  const handleMergeBankStatements = async () => {
    setError(null)
    setMerging(true)

    try {
      const res = await fetch('/api/documents/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to merge bank statements')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Bank_Statements_Combined.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to merge bank statements. Please try again.')
    } finally {
      setMerging(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const uploadFile = async (file: File) => {
    setError(null)
    setUploading(true)

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, and PDF files are allowed')
        return
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('application_id', applicationId)
      formData.append('type', selectedType)
      if (notes) formData.append('notes', notes)

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      setDocuments((prev) => [data.document, ...prev])
      setNotes('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        uploadFile(e.dataTransfer.files[0])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applicationId, selectedType, notes]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const res = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Delete failed')
        return
      }

      setDocuments((prev) => prev.filter((d) => d.id !== documentId))
    } catch {
      setError('Delete failed. Please try again.')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Document Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as DocumentType)}
              className={inputClass}
            >
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {DOCUMENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            rounded-xl p-8 text-center cursor-pointer transition-all ring-1
            ${
              dragActive
                ? 'ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'ring-zinc-200 dark:ring-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 hover:ring-emerald-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
            }
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Uploading...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Drag & drop a file here, or click to browse
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                JPG, PNG, or PDF - Max 10MB
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          Uploaded Documents ({documents.length})
        </h4>

        {documents.length === 0 && !passportScanUrl ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4 text-center">
            No documents uploaded yet
          </p>
        ) : (
          <>
          <div className="space-y-2">
            {passportScanUrl && (
              <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg ring-1 ring-zinc-950/5 dark:ring-white/5">
                <a
                  href={passportScanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 min-w-0 group"
                >
                  <img
                    src={passportScanUrl}
                    alt="Passport scan"
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-700 group-hover:ring-emerald-400 transition-colors"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Passport Scan
                    </p>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Passport &middot; From customer record
                    </span>
                  </div>
                </a>
              </div>
            )}
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg ring-1 ring-zinc-950/5 dark:ring-white/5"
              >
                <a
                  href={documentUrls[doc.id] || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${doc.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 min-w-0 group"
                >
                  {doc.mime_type.startsWith('image/') ? (
                    <img
                      src={documentUrls[doc.id] || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${doc.file_path}`}
                      alt={doc.file_name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-700 group-hover:ring-emerald-400 transition-colors"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                      <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {doc.file_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {DOCUMENT_TYPE_LABELS[doc.type]} &middot;{' '}
                        {formatFileSize(doc.file_size)}
                      </span>
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[doc.status]}`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    {doc.notes && (
                      <p className="text-xs text-zinc-400 mt-0.5 truncate">
                        {doc.notes}
                      </p>
                    )}
                  </div>
                </a>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {bankStatementPdfCount >= 2 && (
            <button
              onClick={handleMergeBankStatements}
              disabled={merging}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:pointer-events-none transition-colors"
            >
              {merging ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Merging...
                </>
              ) : (
                <>
                  <Merge className="w-4 h-4" />
                  Merge Bank Statements ({bankStatementPdfCount} PDFs)
                </>
              )}
            </button>
          )}
          </>
        )}
      </div>
    </div>
  )
}
