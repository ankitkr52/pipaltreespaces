// Request Callback form. Inline Zod resolver (6 lines) in place of
// @hookform/resolvers — same contract, one fewer dep.
'use client';
import { useState } from 'react';
import { useForm, type FieldValues, type Resolver } from 'react-hook-form';
import type { ZodSchema } from 'zod';
import { CallbackPayloadSchema } from '@/lib/validators';
import type { CallbackPayload } from '@/lib/callback';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

function zodResolver<T extends FieldValues>(schema: ZodSchema<T>): Resolver<T> {
  return async (values) => {
    const r = schema.safeParse(values);
    if (r.success) return { values: r.data, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of r.error.issues) {
      const key = issue.path.join('.') || '_';
      if (!errors[key]) errors[key] = { type: 'zod', message: issue.message };
    }
    return { values: {} as T, errors: errors as never };
  };
}

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'ok' }
  | { kind: 'rate-limit' }
  | { kind: 'error'; message: string };

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@pipaltreespaces.com';

export function CallbackForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CallbackPayload>({
    resolver: zodResolver(CallbackPayloadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      city: 'patna',
      message: '',
      honeypot: '',
    },
  });
  const [state, setState] = useState<FormState>({ kind: 'idle' });

  const onSubmit = handleSubmit(async (data) => {
    setState({ kind: 'submitting' });
    let res: Response;
    try {
      res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      setState({ kind: 'error', message: 'Network error. Please try again.' });
      return;
    }

    if (res.ok) {
      reset();
      setState({ kind: 'ok' });
      return;
    }
    if (res.status === 429) {
      setState({ kind: 'rate-limit' });
      return;
    }
    if (res.status === 400) {
      const body = (await res.json().catch(() => null)) as
        | { error?: string; issues?: Array<{ path: Array<string | number>; message: string }> }
        | null;
      if (body?.error === 'validation' && body.issues) {
        for (const issue of body.issues) {
          const field = String(issue.path[0] ?? '') as keyof CallbackPayload;
          setError(field, { type: 'server', message: issue.message });
        }
        setState({ kind: 'idle' });
        return;
      }
    }
    setState({ kind: 'error', message: 'Something went wrong. Please try again.' });
  });

  const submitting = state.kind === 'submitting';

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field label="Name" error={errors.name?.message}>
        <input
          {...register('name')}
          type="text"
          autoComplete="name"
          className={inputCls}
          aria-invalid={!!errors.name}
        />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <input
          {...register('phone')}
          type="tel"
          autoComplete="tel"
          className={inputCls}
          aria-invalid={!!errors.phone}
        />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          {...register('email')}
          type="email"
          autoComplete="email"
          className={inputCls}
          aria-invalid={!!errors.email}
        />
      </Field>
      <Field label="City of interest" error={errors.city?.message}>
        <select {...register('city')} className={inputCls} aria-invalid={!!errors.city}>
          <option value="patna">Patna</option>
          <option value="pune">Pune</option>
          <option value="gaya">Gaya</option>
        </select>
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register('message')}
          rows={4}
          className={inputCls}
          aria-invalid={!!errors.message}
        />
      </Field>

      {/* Honeypot: visually hidden, keyboard-skipped, hidden from AT. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Leave this empty
          <input
            {...register('honeypot')}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {state.kind === 'rate-limit' && (
        <p role="alert" className="text-sm text-red-400">
          Too many requests. Please try again in an hour, or email us directly.
        </p>
      )}
      {state.kind === 'error' && (
        <p role="alert" className="text-sm text-red-400">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Request callback'}
      </Button>

      <p className="text-sm text-text-muted">
        Prefer email?{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline text-brand-gold">
          {CONTACT_EMAIL}
        </a>
      </p>

      {state.kind === 'ok' && (
        <Toast
          message="Thanks — we'll call you back within one business day."
          onDismiss={() => setState({ kind: 'idle' })}
        />
      )}
    </form>
  );
}

const inputCls =
  'w-full rounded-md bg-bg-raised border border-white/10 px-3 py-2 text-text-primary ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base';

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}
function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-text-primary">{label}</span>
      {children}
      <span aria-live="polite" className="min-h-[1.25rem] text-xs text-red-400">
        {error}
      </span>
    </label>
  );
}
