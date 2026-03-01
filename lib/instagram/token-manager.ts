import { createClient } from '@supabase/supabase-js'
import { GRAPH_API_BASE } from './constants'
import type { InstagramConfig } from '@/types/instagram'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface TokenRefreshResponse {
  access_token: string
  token_type: string
  expires_in: number
}

/**
 * Refresh the Meta long-lived access token
 * Long-lived tokens last 60 days. We refresh proactively 7 days before expiry.
 */
export async function refreshAccessToken(
  config: InstagramConfig
): Promise<{ token: string; expiresAt: string } | null> {
  if (!config.meta_access_token || !config.meta_app_id || !config.meta_app_secret) {
    console.error('Missing Meta API credentials for token refresh')
    return null
  }

  const res = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?` +
      new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: config.meta_app_id,
        client_secret: config.meta_app_secret,
        fb_exchange_token: config.meta_access_token,
      })
  )

  if (!res.ok) {
    const error = await res.json()
    console.error('Token refresh failed:', error)
    return null
  }

  const data: TokenRefreshResponse = await res.json()
  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()

  return { token: data.access_token, expiresAt }
}

/**
 * Check if the token needs refreshing (within 7 days of expiry)
 */
export function tokenNeedsRefresh(config: InstagramConfig): boolean {
  if (!config.meta_token_expires_at) return true

  const expiresAt = new Date(config.meta_token_expires_at)
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return expiresAt <= sevenDaysFromNow
}

/**
 * Proactively refresh the token if needed and update the database
 */
export async function ensureValidToken(config: InstagramConfig): Promise<InstagramConfig> {
  if (!tokenNeedsRefresh(config)) {
    return config
  }

  const supabase = getSupabaseAdmin()
  const result = await refreshAccessToken(config)

  if (!result) {
    // Log the failure
    await supabase.from('instagram_activity_log').insert({
      action: 'token_refresh_failed',
      details: 'Failed to refresh Meta access token',
      status: 'error',
    })
    return config
  }

  // Update the config in the database
  const { error } = await supabase
    .from('instagram_config')
    .update({
      meta_access_token: result.token,
      meta_token_expires_at: result.expiresAt,
    })
    .eq('id', config.id)

  if (error) {
    console.error('Failed to save refreshed token:', error)
    return config
  }

  // Log success
  await supabase.from('instagram_activity_log').insert({
    action: 'token_refreshed',
    details: `Token refreshed, expires at ${result.expiresAt}`,
    status: 'success',
  })

  return {
    ...config,
    meta_access_token: result.token,
    meta_token_expires_at: result.expiresAt,
  }
}
