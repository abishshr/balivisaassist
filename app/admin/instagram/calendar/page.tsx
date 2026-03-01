'use client'

import { useEffect, useState } from 'react'
import { ContentCalendarGrid } from '@/components/admin/instagram/ContentCalendar'
import type { ContentCalendar } from '@/types/instagram'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

export default function CalendarPage() {
  const [month, setMonth] = useState(new Date())
  const [entries, setEntries] = useState<ContentCalendar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCalendar()
  }, [month])

  async function fetchCalendar() {
    setLoading(true)
    try {
      // Fetch published posts for this month to show on calendar
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

      const res = await fetch(
        `/api/instagram/posts?limit=50&status=published`
      )
      const data = await res.json()

      // Convert to calendar entries
      const calEntries: ContentCalendar[] = (data.data || [])
        .filter((post: { published_at: string }) => {
          if (!post.published_at) return false
          const date = new Date(post.published_at)
          return date >= startOfMonth && date <= endOfMonth
        })
        .map((post: { id: string; published_at: string; category: string }) => ({
          id: post.id,
          date: new Date(post.published_at).toISOString().split('T')[0],
          category: post.category || 'visa_tip',
          post_id: post.id,
          notes: null,
          created_at: '',
          updated_at: '',
        }))

      setEntries(calEntries)
    } catch (error) {
      console.error('Failed to fetch calendar:', error)
    } finally {
      setLoading(false)
    }
  }

  function prevMonth() {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
  }

  function nextMonth() {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
  }

  const monthName = month.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Content Calendar</h1>
        <p className="text-sm text-zinc-400">
          Weekly content rotation and scheduled posts
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Visa Tip', color: 'bg-blue-400' },
          { label: 'Bali Lifestyle', color: 'bg-emerald-400' },
          { label: 'Service Promo', color: 'bg-amber-400' },
          { label: 'FAQ Answer', color: 'bg-purple-400' },
          { label: 'Immigration News', color: 'bg-red-400' },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            {item.label}
          </span>
        ))}
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-medium text-zinc-100">{monthName}</h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      ) : (
        <ContentCalendarGrid entries={entries} month={month} />
      )}
    </div>
  )
}
