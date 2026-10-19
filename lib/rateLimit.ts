// Token-bucket limiter for the callback edge handler. `handleCallback` takes
// a `Limiter` dep so unit tests swap in a stub.
//
// ponytail: single-isolate correctness; upgrade to Cloudflare KV when logs
// show breaches crossing isolates.

export interface Limiter {
  take(key: string, now: number): boolean;
}

interface Bucket {
  tokens: number;
  updatedAt: number;
}

export interface TokenBucketOptions {
  capacity: number;
  refillPerMs: number;
}

export function createTokenBucketLimiter({ capacity, refillPerMs }: TokenBucketOptions): Limiter {
  const buckets = new Map<string, Bucket>();
  return {
    take(key, now) {
      const b = buckets.get(key);
      if (!b) {
        buckets.set(key, { tokens: capacity - 1, updatedAt: now });
        return true;
      }
      const elapsed = Math.max(0, now - b.updatedAt);
      const tokens = Math.min(capacity, b.tokens + elapsed * refillPerMs);
      if (tokens < 1) {
        b.tokens = tokens;
        b.updatedAt = now;
        return false;
      }
      b.tokens = tokens - 1;
      b.updatedAt = now;
      return true;
    },
  };
}

// 5 req/hour → capacity 5, refill 5 / 3_600_000 ms.
export const CALLBACK_LIMITER_OPTIONS: TokenBucketOptions = {
  capacity: 5,
  refillPerMs: 5 / 3_600_000,
};
