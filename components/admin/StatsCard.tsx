import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  color?: 'emerald' | 'blue' | 'amber' | 'violet'
  className?: string
}

const colorStyles = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
}

export function StatsCard({
  title,
  value,
  description,
  color = 'emerald',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-4 lg:p-5 flex gap-4',
        className
      )}
    >
      <div className={cn('w-1 rounded-full flex-shrink-0', colorStyles[color])} />
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
          {title}
        </h3>
        <p className="text-3xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
          {value}
        </p>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
