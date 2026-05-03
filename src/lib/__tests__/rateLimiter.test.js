import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter } from '../rateLimiter';

describe('RateLimiter', () => {
  let limiter;

  beforeEach(() => {
    limiter = new RateLimiter({ maxRequests: 3, windowMs: 1000 });
  });

  it('allows requests below the limit', () => {
    expect(limiter.check().allowed).toBe(true);
    expect(limiter.check().allowed).toBe(true);
    expect(limiter.check().allowed).toBe(true);
  });

  it('blocks the request at the limit', () => {
    limiter.check();
    limiter.check();
    limiter.check();
    const result = limiter.check();
    expect(result.allowed).toBe(false);
  });

  it('returns remaining count correctly', () => {
    expect(limiter.check().remaining).toBe(2);
    expect(limiter.check().remaining).toBe(1);
    expect(limiter.check().remaining).toBe(0);
  });

  it('returns retryAfterMs > 0 when blocked', () => {
    limiter.check();
    limiter.check();
    limiter.check();
    const { retryAfterMs } = limiter.check();
    expect(retryAfterMs).toBeGreaterThan(0);
    expect(retryAfterMs).toBeLessThanOrEqual(1000);
  });

  it('resets correctly', () => {
    limiter.check();
    limiter.check();
    limiter.check();
    expect(limiter.check().allowed).toBe(false);
    limiter.reset();
    expect(limiter.check().allowed).toBe(true);
  });

  it('reports remaining via the getter', () => {
    limiter.check();
    expect(limiter.remaining).toBe(2);
  });

  it('allows requests again after the window expires', async () => {
    const fastLimiter = new RateLimiter({ maxRequests: 2, windowMs: 50 });
    fastLimiter.check();
    fastLimiter.check();
    expect(fastLimiter.check().allowed).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(fastLimiter.check().allowed).toBe(true);
  });

  it('uses sensible defaults when no options are provided', () => {
    const defaultLimiter = new RateLimiter();
    // Should allow requests (defaults: 10 per 60s)
    expect(defaultLimiter.check().allowed).toBe(true);
  });
});
