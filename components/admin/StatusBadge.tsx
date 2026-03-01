import type { ApplicationStatus } from '@/types/application'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: ApplicationStatus
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string }
> = {
  new: {
    label: 'New',
    bg: 'bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-400',
  },
  documents_pending: {
    label: 'Docs Pending',
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
  },
  documents_received: {
    label: 'Docs Received',
    bg: 'bg-sky-500/10',
    text: 'text-sky-700 dark:text-sky-400',
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-violet-500/10',
    text: 'text-violet-700 dark:text-violet-400',
  },
  submitted_to_immigration: {
    label: 'Submitted',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-700 dark:text-indigo-400',
  },
  approved: {
    label: 'Approved',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-green-500/10',
    text: 'text-green-700 dark:text-green-400',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-500/10',
    text: 'text-red-700 dark:text-red-400',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        config.bg,
        config.text
      )}
    >
      {config.label}
    </span>
  )
}
