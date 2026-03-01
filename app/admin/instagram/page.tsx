'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PostStatusBadge } from '@/components/admin/instagram/PostStatusBadge'
import type { InstagramPost, PostStatus } from '@/types/instagram'
import {
  ImagePlus,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Loader2,
} from 'lucide-react'

interface DashboardStats {
  totalPosts: number
  pendingReview: number
  published: number
  failed: number
}

export default function InstagramDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentPosts, setRecentPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [postsRes, analyticsRes] = await Promise.all([
        fetch('/api/instagram/posts?limit=5'),
        fetch('/api/instagram/analytics?days=30'),
      ])

      const postsData = await postsRes.json()
      const analyticsData = await analyticsRes.json()

      setRecentPosts(postsData.data || [])
      setStats({
        totalPosts: analyticsData.totals?.totalPosts || 0,
        pendingReview: analyticsData.statusBreakdown?.pending_review || 0,
        published: analyticsData.statusBreakdown?.published || 0,
        failed: analyticsData.statusBreakdown?.failed || 0,
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      await fetch('/api/instagram/generate', { method: 'POST', body: JSON.stringify({}) })
      await fetchData()
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setGenerating(false)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Instagram</h1>
          <p className="text-sm text-zinc-400">@balivisaassist content automation</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImagePlus className="w-4 h-4" />
          )}
          {generating ? 'Generating...' : 'Generate Post'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Pending Review"
          value={stats?.pendingReview || 0}
          icon={<Clock className="w-5 h-5 text-purple-400" />}
          href="/admin/instagram/queue"
        />
        <StatCard
          title="Published"
          value={stats?.published || 0}
          icon={<CheckCircle className="w-5 h-5 text-green-400" />}
        />
        <StatCard
          title="Total Posts"
          value={stats?.totalPosts || 0}
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
        />
        <StatCard
          title="Failed"
          value={stats?.failed || 0}
          icon={<Clock className="w-5 h-5 text-red-400" />}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Content Queue', href: '/admin/instagram/queue' },
          { label: 'Calendar', href: '/admin/instagram/calendar' },
          { label: 'Templates', href: '/admin/instagram/templates' },
          { label: 'Settings', href: '/admin/instagram/settings' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            {link.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-100">Recent Posts</h2>
          <Link
            href="/admin/instagram/queue"
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            View All
          </Link>
        </div>
        <div className="divide-y divide-zinc-800">
          {recentPosts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 px-4 py-3">
              <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 truncate">
                  {post.caption?.slice(0, 60) || 'No caption'}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(post.created_at).toLocaleDateString()} &middot;{' '}
                  {post.category?.replace('_', ' ')}
                </p>
              </div>
              <PostStatusBadge status={post.status as PostStatus} />
            </div>
          ))}
          {recentPosts.length === 0 && (
            <p className="px-4 py-6 text-sm text-zinc-500 text-center">
              No posts yet. Generate your first post!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  href,
}: {
  title: string
  value: number
  icon: React.ReactNode
  href?: string
}) {
  const content = (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500">{title}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
