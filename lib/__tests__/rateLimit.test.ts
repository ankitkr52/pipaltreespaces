// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { createTokenBucketLimiter, CALLBACK_LIMITER_OPTIONS } from '@/lib/rateLimit';

describe('createTokenBucketLimiter', () => {
  it('allows up to capacity, then denies', () => {
    const l = createTokenBucketLimiter({ capacity: 3, refillPerMs: 0 });
    expect(l.take('ip', 0)).toBe(true);
    expect(l.take('ip', 0)).toBe(true);
    expect(l.take('ip', 0)).toBe(true);
    expect(l.take('ip', 0)).toBe(false);
  });

  it('refills over time', () => {
    const l = createTokenBucketLimiter({ capacity: 2, refillPerMs: 1 / 1000 });
    expect(l.take('ip', 0)).toBe(true);
    expect(l.take('ip', 0)).toBe(true);
    expect(l.take('ip', 0)).toBe(false);
    expect(l.take('ip', 1000)).toBe(true);
  });

  it('keys buckets independently', () => {
    const l = createTokenBucketLimiter({ capacity: 1, refillPerMs: 0 });
    expect(l.take('a', 0)).toBe(true);
    expect(l.take('a', 0)).toBe(false);
    expect(l.take('b', 0)).toBe(true);
  });

  it('CALLBACK_LIMITER_OPTIONS allows 5 then denies the 6th', () => {
    const l = createTokenBucketLimiter(CALLBACK_LIMITER_OPTIONS);
    for (let i = 0; i < 5; i++) expect(l.take('ip', 0)).toBe(true);
    expect(l.take('ip', 0)).toBe(false);
  });
});
