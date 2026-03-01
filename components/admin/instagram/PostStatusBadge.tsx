'use client'

import { cn } from '@/lib/utils'
import type { PostStatus } from '@/types/instagram'

const statusConfig: Record<PostStatus, { label: string; color: string }> = {
  generating: { label: 'Generating', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  image_pending: { label: 'Image Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  pending_review: { label: 'Pending Review', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  publishing: { label: 'Publishing', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  published: { label: 'Published', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  failed: { label: 'Failed', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  rejected: { label: 'Rejected', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
}

export function PostStatusBadge({ status }: { status: PostStatus }) {
  const config = statusConfig[status] || statusConfig.generating

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.color
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}
