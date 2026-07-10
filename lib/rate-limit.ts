type Bucket = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Bucket>();

/**
 * Simple in-memory rate limiter.
 * For multi-instance production, swap for Upstash Redis or similar.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  store.set(key, existing);
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export const RATE_LIMITS = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  submit: { limit: 5, windowMs: 60 * 60 * 1000 },
  contact: { limit: 5, windowMs: 60 * 60 * 1000 },
} as const;
