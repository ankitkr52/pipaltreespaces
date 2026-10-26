// "Why buy this property" — the persuasive block. Description paragraph +
// highlights as a gold-checked list. Hidden entirely if there's nothing to say.

import type { Property } from "@/lib/types";

export function WhyBuy({ property: p }: { property: Property }) {
  if (!p.description && p.highlights.length === 0) return null;

  return (
    <section aria-labelledby="whybuy-heading">
      <h2 id="whybuy-heading" className="font-display text-h3-m md:text-h3-d text-text-primary tracking-[-0.01em]">
        Why buy this property
      </h2>
      {p.description && (
        <p className="mt-4 max-w-[65ch] text-body-m md:text-body-d text-text-secondary">{p.description}</p>
      )}
      {p.highlights.length > 0 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {p.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 text-body-m text-text-primary">
              <CheckMark />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CheckMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-1 h-4 w-4 shrink-0 text-brand-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
