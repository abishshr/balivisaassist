'use client'

import { useState } from 'react'
import type { InstagramPost, ContentCategory } from '@/types/instagram'
import { Save, X } from 'lucide-react'

interface PostEditorProps {
  post: InstagramPost
  onSave: (updates: Partial<InstagramPost>) => Promise<void>
  onCancel: () => void
}

const categories: ContentCategory[] = [
  'visa_tip',
  'bali_lifestyle',
  'service_promo',
  'faq_answer',
  'immigration_news',
  'testimonial',
]

export function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [caption, setCaption] = useState(post.caption || '')
  const [hashtags, setHashtags] = useState(post.hashtags.join(', '))
  const [category, setCategory] = useState<ContentCategory>(post.category || 'visa_tip')
  const [scheduledFor, setScheduledFor] = useState(
    post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0, 16) : ''
  )
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave({
        caption,
        hashtags: hashtags.split(',').map((h) => h.trim().replace(/^#/, '')).filter(Boolean),
        category: category as ContentCategory,
        scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : null,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-100">Edit Post</h3>
        <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-200">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={6}
            maxLength={2200}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
          <span className="text-xs text-zinc-500">{caption.length}/2200</span>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Hashtags (comma-separated)
          </label>
          <input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ContentCategory)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Schedule For</label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
