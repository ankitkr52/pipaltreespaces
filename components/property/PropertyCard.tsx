// PropertyCard — anchor component for the whole site.
// Distinctive move: the price is set in Fraunces (serif), gold, tabular.
// Every other number stays Inter.
//
// A3: a 24px status-pill slot is reserved even when no pill is applied — CLS floor.
// Locality + area separator: a 1px bronze vertical rule, not a middle-dot.

import Image from "next/image";
import Link from "next/link";
import type { Property, Possession } from "@/lib/types";
import { formatPrice, formatArea } from "@/lib/format";

const POSSESSION_META: Record<
  Possession,
  { label: string; dotClass: string }
> = {
  ready: { label: "Ready to move", dotClass: "bg-signal-success" },
  "under-construction": {
    label: "Under construction",
    dotClass: "bg-signal-warn",
  },
  upcoming: { label: "Upcoming", dotClass: "bg-signal-info" },
};

export function PropertyCard({ property: p }: { property: Property }) {
  const possession = POSSESSION_META[p.possession];
  const detailHref = `/${p.city}/${p.category}/${p.slug}`;
  const cover = p.images[0];

  return (
    <article className="group relative bg-bg-raised border border-border-subtle rounded-card overflow-hidden shadow-lift-inner transition-colors duration-hover hover:border-border-strong">
      <Link
        href={detailHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        aria-label={`${p.title} — ${formatPrice(p)}`}
      >
        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
          <Image
            src={cover}
            alt={p.title}
            fill
            sizes="(min-width:1024px) 400px, (min-width:768px) 50vw, 100vw"
            className="object-cover transition-transform duration-hover motion-safe:group-hover:scale-[1.02]"
          />
          {p.featured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bg-sunken/80 px-2.5 py-1 text-meta-m text-brand-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              Featured
            </span>
          )}
        </div>

        <div className="p-5">
          {/* A3 — reserved status slot: fixed 24px row even when empty */}
          <div className="h-6 mb-2 flex items-center gap-3 text-meta-m text-text-secondary">
            <span className="inline-flex items-center gap-2">
              <span className={"h-2 w-2 rounded-full " + possession.dotClass} aria-hidden />
              {possession.label}
            </span>
            {p.plotSubtype && (
              <span className="text-brand-bronze">
                {p.plotSubtype === "plotted-development" ? "Plotted Development" : "Standalone"}
              </span>
            )}
          </div>

          <h3 className="font-display text-h3-m md:text-h3-d text-text-primary tracking-[-0.01em] line-clamp-2">
            {p.title}
          </h3>

          {/* Locality + area meta, separated by a 1px bronze vertical rule — not a middle-dot */}
          <div className="mt-2 flex items-center text-meta-m md:text-meta-d text-text-secondary">
            <span className="truncate">{p.location.locality}</span>
            <span aria-hidden className="mx-3 h-3 w-px bg-brand-bronze/60" />
            <span className="shrink-0">{formatArea(p)}</span>
            {p.bhk && (
              <>
                <span aria-hidden className="mx-3 h-3 w-px bg-brand-bronze/60" />
                <span className="shrink-0">{p.bhk} BHK</span>
              </>
            )}
          </div>

          {/* Price — Fraunces, gold, tabular. The one serif number on the card. */}
          <p className="mt-4 font-display text-h3-d tabular-nums text-brand-gold">
            {formatPrice(p)}
          </p>

          {/* RERA — Inter 500 tabular with a bronze hairline below, not monospace */}
          <p className="mt-3 inline-block text-meta-m text-text-muted tabular-nums border-b border-brand-bronze/40 pb-[2px]">
            RERA {p.rera}
          </p>
        </div>
      </Link>
    </article>
  );
}
