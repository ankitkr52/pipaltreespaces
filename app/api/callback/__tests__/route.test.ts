// @vitest-environment node
// Smoke: request/response round-trip through the route adapter with
// handleCallback stubbed. Behavior tests live in lib/__tests__/callback.test.ts.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const handleCallback = vi.fn();
vi.mock('@/lib/callback', () => ({ handleCallback }));
vi.mock('resend', () => ({ Resend: class {} }));

async function loadPost() {
  const mod = await import('@/app/api/callback/route');
  return mod.POST;
}

beforeEach(() => {
  handleCallback.mockReset();
});

describe('POST /api/callback adapter', () => {
  it('maps handleCallback result to a Response', async () => {
    handleCallback.mockResolvedValue({ status: 200, body: { ok: true } });
    const POST = await loadPost();
    const req = new Request('https://x/api/callback', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cf-connecting-ip': '1.2.3.4' },
      body: JSON.stringify({ hi: 'there' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const [parsedBody, deps] = handleCallback.mock.calls[0];
    expect(parsedBody).toEqual({ hi: 'there' });
    expect(deps.limiterKey).toBe('1.2.3.4');
    expect(typeof deps.send).toBe('function');
    expect(deps.limiter).toBeTruthy();
  });

  it('returns 400 invalid-json on parse failure (handleCallback not called)', async () => {
    const POST = await loadPost();
    const req = new Request('https://x/api/callback', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{not json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: 'invalid-json' });
    expect(handleCallback).not.toHaveBeenCalled();
  });
});
