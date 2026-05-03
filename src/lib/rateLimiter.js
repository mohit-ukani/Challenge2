/**
 * RateLimiter — Token-bucket rate limiter for client-side request throttling.
 * Prevents API abuse by enforcing a maximum number of requests per time window.
 *
 * @example
 * const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60000 });
 * const result = limiter.check();
 * if (!result.allowed) console.warn(`Retry after ${result.retryAfterMs}ms`);
 */
export class RateLimiter {
  /**
   * @param {Object} options
   * @param {number} options.maxRequests - Maximum allowed requests per window
   * @param {number} options.windowMs   - Time window in milliseconds
   */
  constructor({ maxRequests = 10, windowMs = 60000 } = {}) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    /** @type {number[]} Timestamps of recent requests */
    this.timestamps = [];
  }

  /**
   * Check whether a new request is allowed and record it if so.
   * @returns {{ allowed: boolean, retryAfterMs: number, remaining: number }}
   */
  check() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Evict timestamps outside the current window
    this.timestamps = this.timestamps.filter((t) => t > windowStart);

    if (this.timestamps.length >= this.maxRequests) {
      const oldest = this.timestamps[0];
      const retryAfterMs = oldest + this.windowMs - now;
      return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs), remaining: 0 };
    }

    this.timestamps.push(now);
    return {
      allowed: true,
      retryAfterMs: 0,
      remaining: this.maxRequests - this.timestamps.length,
    };
  }

  /**
   * Reset the limiter state (useful for testing).
   */
  reset() {
    this.timestamps = [];
  }

  /**
   * Returns how many requests remain in the current window.
   * @returns {number}
   */
  get remaining() {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const active = this.timestamps.filter((t) => t > windowStart);
    return Math.max(0, this.maxRequests - active.length);
  }
}

/** Shared rate limiter instance for the AI chat (10 messages/minute). */
export const chatRateLimiter = new RateLimiter({ maxRequests: 10, windowMs: 60000 });
