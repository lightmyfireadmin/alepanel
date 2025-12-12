/**
 * Simple in-memory rate limiter for API routes
 * For production, use Redis or similar for distributed limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
};

/**
 * Check if request is rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Object with isLimited flag and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): { isLimited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    cleanupExpiredEntries();
  }

  if (!entry || now > entry.resetTime) {
    // Create new entry
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      isLimited: false,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limited
    return {
      isLimited: true,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    isLimited: false,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxied requests)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback - in production, this won't be reliable
  return "unknown";
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  contact: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  newsletter: { maxRequests: 3, windowMs: 60 * 1000 }, // 3 per minute
  api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute
};
