import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin()
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '30')

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  // Get published posts with analytics
  const { data: posts } = await supabase
    .from('instagram_posts')
    .select('id, caption, category, published_at, ig_permalink')
    .eq('status', 'published')
    .gte('published_at', since)
    .order('published_at', { ascending: false })

  // Get analytics for those posts
  const postIds = (posts || []).map((p) => p.id)
  const { data: analytics } = await supabase
    .from('instagram_analytics')
    .select('*')
    .in('post_id', postIds.length > 0 ? postIds : ['none'])

  // Get status breakdown
  const { data: statusCounts } = await supabase
    .from('instagram_posts')
    .select('status')

  const statusBreakdown: Record<string, number> = {}
  for (const row of statusCounts || []) {
    statusBreakdown[row.status] = (statusBreakdown[row.status] || 0) + 1
  }

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from('instagram_activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  // Aggregate totals
  const totals = {
    totalPosts: posts?.length || 0,
    totalImpressions: 0,
    totalReach: 0,
    totalLikes: 0,
    totalComments: 0,
    totalSaves: 0,
    avgEngagementRate: 0,
  }

  if (analytics && analytics.length > 0) {
    for (const a of analytics) {
      totals.totalImpressions += a.impressions || 0
      totals.totalReach += a.reach || 0
      totals.totalLikes += a.likes || 0
      totals.totalComments += a.comments || 0
      totals.totalSaves += a.saves || 0
    }
    totals.avgEngagementRate =
      analytics.reduce((sum, a) => sum + (a.engagement_rate || 0), 0) / analytics.length
  }

  return NextResponse.json({
    totals,
    statusBreakdown,
    posts: (posts || []).map((post) => ({
      ...post,
      analytics: analytics?.find((a) => a.post_id === post.id) || null,
    })),
    recentActivity,
  })
}
