// Minimal role="status" toast. Auto-dismisses after `durationMs`. Reused
// by filter transitions too.
'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ message, onDismiss, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-bg-raised text-text-primary px-5 py-3 text-sm shadow-lg border border-brand-gold/30"
    >
      {message}
    </div>
  );
}
