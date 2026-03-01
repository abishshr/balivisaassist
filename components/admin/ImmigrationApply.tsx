'use client'

import { useState } from 'react'
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react'

interface ImmigrationApplyProps {
  applicationId: string
  applicationNumber: string
}

export function ImmigrationApply({ applicationId, applicationNumber }: ImmigrationApplyProps) {
  const [copied, setCopied] = useState<'command' | 'id' | null>(null)

  const command = `npx tsx scripts/apply-immigration.ts ${applicationId}`

  async function copyToClipboard(text: string, type: 'command' | 'id') {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Run the automation script on your local machine to fill the immigration portal form.
        The script opens a browser, lets you solve the CAPTCHA, then fills in all applicant data and uploads documents.
      </p>

      <div className="space-y-3">
        {/* Command to copy */}
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">
            Run this command in the project directory:
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-zinc-950 dark:bg-zinc-950 rounded-md px-3 py-2.5 font-mono text-sm text-emerald-400 overflow-x-auto">
              <Terminal className="w-4 h-4 flex-shrink-0 text-zinc-500" />
              <code className="whitespace-nowrap">{command}</code>
            </div>
            <button
              onClick={() => copyToClipboard(command, 'command')}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {copied === 'command' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Application ID */}
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">
            Application ID:
          </label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-md px-3 py-2 font-mono text-sm text-zinc-700 dark:text-zinc-300">
              {applicationId}
            </code>
            <button
              onClick={() => copyToClipboard(applicationId, 'id')}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {copied === 'id' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-md px-3 py-2.5">
        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">Prerequisites</p>
        <ul className="text-xs text-amber-600 dark:text-amber-400/80 space-y-0.5 list-disc list-inside">
          <li>Playwright browser installed: <code className="font-mono">npx playwright install chromium</code></li>
          <li><code className="font-mono">IMMIGRATION_EMAIL</code> and <code className="font-mono">IMMIGRATION_PASSWORD</code> set in <code className="font-mono">.env.local</code></li>
          <li>All required documents uploaded to this application</li>
        </ul>
      </div>

      {/* Portal link */}
      <a
        href="https://evisa.imigrasi.go.id"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open immigration portal manually
      </a>
    </div>
  )
}
