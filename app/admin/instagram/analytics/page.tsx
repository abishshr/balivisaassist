'use client'

import { useEffect, useState } from 'react'
import { PostStatusBadge } from '@/components/admin/instagram/PostStatusBadge'
import type { PostStatus } from '@/types/instagram'
import {
  Loader2,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  TrendingUp,
} from 'lucide-react'

interface AnalyticsData {
  totals: {
    totalPosts: number
    totalImpressions: number
    totalReach: number
    totalLikes: number
    totalComments: number
    totalSaves: number
    avgEngagementRate: number
  }
  statusBreakdown: Record<string, number>
  posts: Array<{
    id: string
    caption: string | null
    category: string | null
    published_at: string | null
    ig_permalink: string | null
    analytics: {
      impressions: number
      reach: number
      likes: number
      comments: number
      saves: number
      engagement_rate: number
    } | null
  }>
  recentActivity: Array<{
    id: string
    action: string
    details: string | null
    status: string
    created_at: string
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  async function fetchAnalytics() {
    setLoading(true)
    try {
      const res = await fetch(`/api/instagram/analytics?days=${days}`)
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !data) {
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
          <h1 className="text-2xl font-bold text-zinc-100">Analytics</h1>
          <p className="text-sm text-zinc-400">Post performance and engagement</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard icon={<TrendingUp className="w-4 h-4" />} label="Posts" value={data.totals.totalPosts} />
        <MetricCard icon={<Eye className="w-4 h-4" />} label="Impressions" value={data.totals.totalImpressions} />
        <MetricCard icon={<Eye className="w-4 h-4" />} label="Reach" value={data.totals.totalReach} />
        <MetricCard icon={<Heart className="w-4 h-4" />} label="Likes" value={data.totals.totalLikes} />
        <MetricCard icon={<MessageCircle className="w-4 h-4" />} label="Comments" value={data.totals.totalComments} />
        <MetricCard icon={<Bookmark className="w-4 h-4" />} label="Saves" value={data.totals.totalSaves} />
      </div>

      {/* Status Breakdown */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h2 className="text-sm font-medium text-zinc-100 mb-3">Post Status Breakdown</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(data.statusBreakdown).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2">
              <PostStatusBadge status={status as PostStatus} />
              <span className="text-sm text-zinc-300 font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Post Performance */}
      {data.posts.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <h2 className="text-sm font-medium text-zinc-100 px-4 py-3 border-b border-zinc-800">
            Post Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-xs border-b border-zinc-800">
                  <th className="px-4 py-2 text-left">Post</th>
                  <th className="px-4 py-2 text-right">Impressions</th>
                  <th className="px-4 py-2 text-right">Reach</th>
                  <th className="px-4 py-2 text-right">Likes</th>
                  <th className="px-4 py-2 text-right">Comments</th>
                  <th className="px-4 py-2 text-right">Saves</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-4 py-3">
                      <p className="text-zinc-300 truncate max-w-xs">
                        {post.caption?.slice(0, 50) || 'No caption'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {post.published_at && new Date(post.published_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300">
                      {post.analytics?.impressions || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300">
                      {post.analytics?.reach || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300">
                      {post.analytics?.likes || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300">
                      {post.analytics?.comments || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300">
                      {post.analytics?.saves || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <h2 className="text-sm font-medium text-zinc-100 px-4 py-3 border-b border-zinc-800">
          Recent Activity
        </h2>
        <div className="divide-y divide-zinc-800">
          {data.recentActivity.map((activity) => (
            <div key={activity.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-300">{activity.action.replace(/_/g, ' ')}</p>
                {activity.details && (
                  <p className="text-xs text-zinc-500 mt-0.5">{activity.details}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    activity.status === 'success'
                      ? 'bg-green-400'
                      : activity.status === 'error'
                      ? 'bg-red-400'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="text-xs text-zinc-500">
                  {new Date(activity.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          {data.recentActivity.length === 0 && (
            <p className="px-4 py-6 text-sm text-zinc-500 text-center">
              No activity yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-lg font-bold text-zinc-100">
        {value.toLocaleString()}
      </p>
    </div>
  )
}
