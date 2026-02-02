/**
 * Simple in-memory rate limiter
 * For production, consider using Vercel KV or Upstash Redis
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (will reset on server restart)
const store = new Map<string, RateLimitRecord>();

/**
 * Rate limit configuration
 */
const RATE_LIMIT_CONFIG = {
  maxRequests: 5, // Maximum requests per window
  windowMs: 60 * 60 * 1000, // 1 hour window
};

/**
 * Check if IP is rate limited
 * @param identifier - Usually the IP address or user identifier
 * @returns Object with { success: boolean, limit: number, remaining: number, reset: number }
 */
export function checkRateLimit(identifier: string): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const record = store.get(identifier);

  // Clean up expired records periodically
  if (Math.random() < 0.1) {
    cleanupExpiredRecords();
  }

  if (!record || now > record.resetTime) {
    // No record or expired - create new record
    const resetTime = now + RATE_LIMIT_CONFIG.windowMs;
    store.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      success: true,
      limit: RATE_LIMIT_CONFIG.maxRequests,
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1,
      reset: resetTime,
    };
  }

  // Check if limit exceeded
  if (record.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return {
      success: false,
      limit: RATE_LIMIT_CONFIG.maxRequests,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Increment count
  record.count += 1;
  store.set(identifier, record);

  return {
    success: true,
    limit: RATE_LIMIT_CONFIG.maxRequests,
    remaining: RATE_LIMIT_CONFIG.maxRequests - record.count,
    reset: record.resetTime,
  };
}

/**
 * Clean up expired rate limit records
 */
function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}

/**
 * Get client IP address from request headers
 * Works with Vercel and most hosting providers
 */
export function getClientIP(headers: Headers): string {
  // Try various headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  // Fallback
  return 'unknown';
}
