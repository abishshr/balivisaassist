'use client'

import { useEffect, useState } from 'react'
import type { InstagramConfig } from '@/types/instagram'
import { Save, Loader2, CheckCircle, AlertCircle, Key, Clock } from 'lucide-react'

export default function SettingsPage() {
  const [config, setConfig] = useState<Partial<InstagramConfig>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  async function fetchConfig() {
    try {
      const res = await fetch('/api/instagram/config')
      const data = await res.json()
      setConfig(data.data || {})
    } catch (error) {
      console.error('Failed to fetch config:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/instagram/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ig_business_account_id: config.ig_business_account_id,
          facebook_page_id: config.facebook_page_id,
          auto_approve: config.auto_approve,
          default_posting_time: config.default_posting_time,
          posting_timezone: config.posting_timezone,
          max_hashtags: config.max_hashtags,
          is_active: config.is_active,
        }),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully' })
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to save' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    )
  }

  const tokenExpiresAt = config.meta_token_expires_at
    ? new Date(config.meta_token_expires_at)
    : null
  const tokenDaysLeft = tokenExpiresAt
    ? Math.ceil((tokenExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Instagram Settings</h1>
        <p className="text-sm text-zinc-400">
          Configure automation preferences and API connections
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message.text}
        </div>
      )}

      {/* Token Status */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-medium text-zinc-100">API Token Status</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Meta Access Token</span>
            <span className="text-sm text-zinc-300">
              {config.meta_access_token || 'Not configured'}
            </span>
          </div>
          {tokenDaysLeft !== null && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Token Expires</span>
              <span
                className={`flex items-center gap-1 text-sm ${
                  tokenDaysLeft > 7 ? 'text-green-400' : tokenDaysLeft > 0 ? 'text-amber-400' : 'text-red-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {tokenDaysLeft > 0 ? `${tokenDaysLeft} days` : 'Expired'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h2 className="text-sm font-medium text-zinc-100">General Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-zinc-300">Automation Active</label>
              <p className="text-xs text-zinc-500">Enable/disable the posting pipeline</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.is_active ?? true}
                onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:bg-emerald-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-zinc-300">Auto-Approve Posts</label>
              <p className="text-xs text-zinc-500">
                Skip review and auto-approve AI-generated posts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.auto_approve ?? false}
                onChange={(e) => setConfig({ ...config, auto_approve: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:bg-emerald-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">
              Facebook Page ID
            </label>
            <input
              value={config.facebook_page_id || ''}
              onChange={(e) => setConfig({ ...config, facebook_page_id: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">
              IG Business Account ID
            </label>
            <input
              value={config.ig_business_account_id || ''}
              onChange={(e) => setConfig({ ...config, ig_business_account_id: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-1">
                Default Posting Time
              </label>
              <input
                type="time"
                value={config.default_posting_time || '10:00'}
                onChange={(e) => setConfig({ ...config, default_posting_time: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">
                Max Hashtags
              </label>
              <input
                type="number"
                value={config.max_hashtags || 20}
                onChange={(e) => setConfig({ ...config, max_hashtags: parseInt(e.target.value) })}
                min={1}
                max={30}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
