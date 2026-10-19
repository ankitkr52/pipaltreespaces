// Behavior for POST /api/callback. Pure of `Request`/env/Resend — the route
// adapter injects `send` + `limiter`, tests inject stubs.
import { z } from 'zod';
import { CallbackPayloadSchema } from '@/lib/validators';
import type { Limiter } from '@/lib/rateLimit';

export type CallbackPayload = z.infer<typeof CallbackPayloadSchema>;

export type SendFn = (payload: CallbackPayload) => Promise<void>;

export interface CallbackDeps {
  send: SendFn;
  limiter: Limiter;
  limiterKey: string;
  now?: () => number;
}

export type CallbackResult =
  | { status: 200; body: { ok: true } }
  | { status: 400; body: { ok: false; error: 'validation'; issues: z.ZodIssue[] } }
  | { status: 429; body: { ok: false; error: 'rate-limit' } }
  | { status: 502; body: { ok: false; error: 'send-failed' } };

export async function handleCallback(
  rawPayload: unknown,
  deps: CallbackDeps,
): Promise<CallbackResult> {
  const parsed = CallbackPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: 'validation', issues: parsed.error.issues } };
  }
  const payload = parsed.data;

  // Silent-drop bot submits. Do NOT short-circuit before validation — we want
  // malformed real users to still see field errors.
  if (payload.honeypot.length > 0) {
    return { status: 200, body: { ok: true } };
  }

  const now = deps.now ? deps.now() : Date.now();
  if (!deps.limiter.take(deps.limiterKey, now)) {
    return { status: 429, body: { ok: false, error: 'rate-limit' } };
  }

  try {
    await deps.send(payload);
  } catch {
    return { status: 502, body: { ok: false, error: 'send-failed' } };
  }

  return { status: 200, body: { ok: true } };
}
