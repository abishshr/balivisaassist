'use client'

import { cn } from '@/lib/utils'
import type { ContentCalendar as CalendarEntry, ContentCategory } from '@/types/instagram'
import { WEEKLY_ROTATION } from '@/lib/instagram/constants'

interface ContentCalendarProps {
  entries: CalendarEntry[]
  month: Date
}

const categoryColors: Record<ContentCategory, string> = {
  visa_tip: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  bali_lifestyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  service_promo: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  faq_answer: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  immigration_news: 'bg-red-500/20 text-red-400 border-red-500/30',
  testimonial: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  bali_news: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function ContentCalendarGrid({ entries, month }: ContentCalendarProps) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()

  const firstDay = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  const today = new Date().toISOString().split('T')[0]

  const entryMap = new Map<string, CalendarEntry>()
  for (const entry of entries) {
    entryMap.set(entry.date, entry)
  }

  const cells: Array<{ day: number | null; date: string; entry: CalendarEntry | null }> = []

  // Padding days
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, date: '', entry: null })
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const entry = entryMap.get(dateStr) || null
    cells.push({ day: d, date: dateStr, entry })
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-zinc-800">
        {dayNames.map((name) => (
          <div
            key={name}
            className="px-2 py-2 text-center text-xs font-medium text-zinc-500"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          if (cell.day === null) {
            return <div key={`empty-${i}`} className="min-h-[80px] bg-zinc-950/50" />
          }

          const isToday = cell.date === today
          const dayOfWeek = new Date(cell.date).getDay()
          const defaultCategory = WEEKLY_ROTATION[dayOfWeek]
          const category = cell.entry?.category || defaultCategory
          const colorClass = categoryColors[category as ContentCategory] || categoryColors.visa_tip

          return (
            <div
              key={cell.date}
              className={cn(
                'min-h-[80px] p-2 border-b border-r border-zinc-800',
                isToday && 'bg-emerald-500/5'
              )}
            >
              <span
                className={cn(
                  'text-xs font-medium',
                  isToday ? 'text-emerald-400' : 'text-zinc-400'
                )}
              >
                {cell.day}
              </span>
              <div className="mt-1">
                <span
                  className={cn(
                    'inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border',
                    colorClass,
                    !cell.entry && 'opacity-40'
                  )}
                >
                  {(category as string).replace('_', ' ')}
                </span>
                {cell.entry?.post_id && (
                  <div className="mt-1 w-2 h-2 rounded-full bg-green-500" title="Post linked" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
