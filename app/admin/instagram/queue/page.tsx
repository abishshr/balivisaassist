'use client'

import { useEffect, useState, useCallback } from 'react'
import { PostCard } from '@/components/admin/instagram/PostCard'
import type { InstagramPost, PostStatus } from '@/types/instagram'
import { Loader2, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusFilters: Array<{ label: string; value: string }> = [
  { label: 'All', value: '' },
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Published', value: 'published' },
  { label: 'Failed', value: 'failed' },
  { label: 'Rejected', value: 'rejected' },
]

export default function ContentQueuePage() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/instagram/posts?${params}`)
      const data = await res.json()
      setPosts(data.data || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  async function handleApprove(id: string) {
    await fetch(`/api/instagram/posts/${id}/approve`, { method: 'POST' })
    fetchPosts()
  }

  async function handleReject(id: string) {
    await fetch(`/api/instagram/posts/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
    fetchPosts()
  }

  async function handleRegenerate(id: string) {
    await fetch(`/api/instagram/posts/${id}/regenerate`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
    fetchPosts()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/instagram/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  const pendingCount = posts.filter((p) => p.status === 'pending_review').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Content Queue</h1>
        <p className="text-sm text-zinc-400">
          Review and approve AI-generated posts
          {pendingCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs">
              {pendingCount} pending
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0" />
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
              statusFilter === filter.value
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">No posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onApprove={handleApprove}
              onReject={handleReject}
              onRegenerate={handleRegenerate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
