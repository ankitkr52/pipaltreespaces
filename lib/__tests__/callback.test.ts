// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { handleCallback, type CallbackPayload } from '@/lib/callback';
import type { Limiter } from '@/lib/rateLimit';

const good: CallbackPayload = {
  name: 'Ravi Kumar',
  phone: '+919876543210',
  email: 'ravi@example.com',
  city: 'patna',
  message: 'I would like a callback about 3BHK in Boring Road.',
  honeypot: '',
};

const allowLimiter: Limiter = { take: () => true };
const denyLimiter: Limiter = { take: () => false };

describe('handleCallback', () => {
  it('400 validation when payload fails Zod', async () => {
    const send = vi.fn();
    const res = await handleCallback(
      { ...good, name: 'x' },
      { send, limiter: allowLimiter, limiterKey: 'ip' },
    );
    expect(res.status).toBe(400);
    if (res.status === 400) {
      expect(res.body.error).toBe('validation');
      expect(res.body.issues.length).toBeGreaterThan(0);
    }
    expect(send).not.toHaveBeenCalled();
  });

  it('200 silent when honeypot filled; send not called', async () => {
    const send = vi.fn();
    const res = await handleCallback(
      { ...good, honeypot: 'spam' },
      { send, limiter: allowLimiter, limiterKey: 'ip' },
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it('200 ok on valid payload; send called once with payload', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const res = await handleCallback(good, { send, limiter: allowLimiter, limiterKey: 'ip' });
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(good);
  });

  it('429 when limiter denies', async () => {
    const send = vi.fn();
    const res = await handleCallback(good, { send, limiter: denyLimiter, limiterKey: 'ip' });
    expect(res.status).toBe(429);
    expect(res.body).toEqual({ ok: false, error: 'rate-limit' });
    expect(send).not.toHaveBeenCalled();
  });

  it('502 when send throws', async () => {
    const send = vi.fn().mockRejectedValue(new Error('resend down'));
    const res = await handleCallback(good, { send, limiter: allowLimiter, limiterKey: 'ip' });
    expect(res.status).toBe(502);
    expect(res.body).toEqual({ ok: false, error: 'send-failed' });
  });
});
