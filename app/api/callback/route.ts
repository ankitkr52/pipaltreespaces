// Thin HTTP adapter around handleCallback. Owns `Request` parsing + building
// the real `send` (Resend) + `limiter` from env. All behavior lives in
// lib/callback.ts.
import { Resend } from 'resend';
import { handleCallback, type SendFn } from '@/lib/callback';
import { createTokenBucketLimiter, CALLBACK_LIMITER_OPTIONS, type Limiter } from '@/lib/rateLimit';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Module-scope so one isolate reuses the same bucket across requests.
// ponytail: in-memory single-isolate; swap for Cloudflare KV if logs show
// breaches crossing isolates.
const limiter: Limiter = createTokenBucketLimiter(CALLBACK_LIMITER_OPTIONS);

export async function POST(req: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;

  const send: SendFn = apiKey && to
    ? async (p) => {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
          from: 'callback@mail.pipaltreespaces.com',
          to,
          subject: `Callback: ${p.city} · ${p.name}`,
          text: callbackEmailBody(p),
        });
        if (error) throw new Error(error.message);
      }
    : async (p) => {
        console.warn('[callback stub]', p);
      };

  const limiterKey = req.headers.get('cf-connecting-ip') ?? 'unknown';
  const result = await handleCallback(payload, { send, limiter, limiterKey });
  return Response.json(result.body, { status: result.status });
}

function callbackEmailBody(p: {
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
}): string {
  const waHref = `https://wa.me/${p.phone.replace(/[^\d]/g, '')}`;
  return [
    `Name: ${p.name}`,
    `Phone: ${p.phone}`,
    `Email: ${p.email}`,
    `City: ${p.city}`,
    '',
    'Message:',
    p.message,
    '',
    `Reply on WhatsApp: ${waHref}`,
  ].join('\n');
}
