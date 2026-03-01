'use client'

import { useEffect, useState } from 'react'
import type { ContentTemplate, ContentCategory } from '@/types/instagram'
import { Plus, Edit2, Loader2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories: ContentCategory[] = [
  'visa_tip',
  'bali_lifestyle',
  'service_promo',
  'faq_answer',
  'immigration_news',
  'testimonial',
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'visa_tip' as ContentCategory,
    caption_prompt: '',
    image_prompt_template: '',
    hashtag_pool: '',
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    try {
      const res = await fetch('/api/instagram/templates')
      const data = await res.json()
      setTemplates(data.data || [])
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await fetch('/api/instagram/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hashtag_pool: formData.hashtag_pool
            .split(',')
            .map((h) => h.trim().replace(/^#/, ''))
            .filter(Boolean),
        }),
      })
      setShowForm(false)
      setFormData({
        name: '',
        category: 'visa_tip',
        caption_prompt: '',
        image_prompt_template: '',
        hashtag_pool: '',
      })
      fetchTemplates()
    } catch (error) {
      console.error('Failed to create template:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Content Templates</h1>
          <p className="text-sm text-zinc-400">
            Prompt templates for AI content generation
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ContentCategory })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Caption Prompt</label>
            <textarea
              value={formData.caption_prompt}
              onChange={(e) => setFormData({ ...formData, caption_prompt: e.target.value })}
              rows={4}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Image Prompt Template</label>
            <textarea
              value={formData.image_prompt_template}
              onChange={(e) => setFormData({ ...formData, image_prompt_template: e.target.value })}
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Hashtag Pool (comma-separated)
            </label>
            <input
              value={formData.hashtag_pool}
              onChange={(e) => setFormData({ ...formData, hashtag_pool: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500"
            >
              Create Template
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Templates List */}
      <div className="space-y-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-zinc-100">{template.name}</h3>
                  <span
                    className={cn(
                      'inline-block mt-1 px-2 py-0.5 rounded text-xs',
                      'bg-zinc-800 text-zinc-400'
                    )}
                  >
                    {template.category.replace('_', ' ')}
                  </span>
                  <p className="mt-2 text-xs text-zinc-500 line-clamp-2">
                    {template.caption_prompt}
                  </p>
                  {template.hashtag_pool.length > 0 && (
                    <p className="mt-1 text-xs text-zinc-600">
                      {template.hashtag_pool.slice(0, 5).map((h) => `#${h}`).join(' ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>Used {template.usage_count}x</span>
                <button className="p-1 rounded hover:bg-zinc-800">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <p className="text-center py-8 text-zinc-500 text-sm">
            No templates yet. Create one to get started.
          </p>
        )}
      </div>
    </div>
  )
}
