'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PostStatusBadge } from './PostStatusBadge'
import { cn } from '@/lib/utils'
import type { InstagramPost, PostStatus } from '@/types/instagram'
import {
  Check,
  X,
  RefreshCw,
  Calendar,
  ExternalLink,
  Trash2,
  ImageIcon,
} from 'lucide-react'

interface PostCardProps {
  post: InstagramPost
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onRegenerate?: (id: string) => void
  onDelete?: (id: string) => void
}

export function PostCard({
  post,
  onApprove,
  onReject,
  onRegenerate,
  onDelete,
}: PostCardProps) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(action: string, handler?: (id: string) => void) {
    if (!handler) return
    setLoading(action)
    try {
      await handler(post.id)
    } finally {
      setLoading(null)
    }
  }

  const hashtagString = post.hashtags
    .slice(0, 5)
    .map((h) => `#${h}`)
    .join(' ')

  const isReviewable = post.status === 'pending_review'
  const showActions = ['pending_review', 'failed', 'rejected'].includes(post.status)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square bg-zinc-800">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.caption?.slice(0, 50) || 'Instagram post'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <PostStatusBadge status={post.status as PostStatus} />
        </div>
        {post.category && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-zinc-900/80 text-xs text-zinc-300">
            {post.category.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Caption */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-zinc-300 line-clamp-3">
          {post.caption || 'No caption yet...'}
        </p>

        {post.hashtags.length > 0 && (
          <p className="text-xs text-zinc-500 truncate">{hashtagString}...</p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
          {post.source !== 'ai_generated' && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
              {post.source}
            </span>
          )}
          {post.ig_permalink && (
            <a
              href={post.ig_permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
            >
              <ExternalLink className="w-3 h-3" />
              View
            </a>
          )}
        </div>

        {post.error_message && (
          <p className="text-xs text-red-400 bg-red-500/10 rounded px-2 py-1">
            {post.error_message}
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
            {isReviewable && (
              <>
                <button
                  onClick={() => handleAction('approve', onApprove)}
                  disabled={loading !== null}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors',
                    'bg-emerald-600 text-white hover:bg-emerald-500',
                    loading === 'approve' && 'opacity-50'
                  )}
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve
                </button>
                <button
                  onClick={() => handleAction('reject', onReject)}
                  disabled={loading !== null}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors',
                    'bg-zinc-700 text-zinc-300 hover:bg-zinc-600',
                    loading === 'reject' && 'opacity-50'
                  )}
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => handleAction('regenerate', onRegenerate)}
              disabled={loading !== null}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors',
                'bg-zinc-700 text-zinc-300 hover:bg-zinc-600',
                loading === 'regenerate' && 'opacity-50 animate-spin'
              )}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
            {onDelete && (
              <button
                onClick={() => handleAction('delete', onDelete)}
                disabled={loading !== null}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ml-auto',
                  'text-red-400 hover:bg-red-500/10',
                  loading === 'delete' && 'opacity-50'
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
