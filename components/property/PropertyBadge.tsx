// Status pill (possession) + optional plot-subtype badge.
// Extracted from PropertyCard's inline status row so the detail page and the
// card render the same badge; PropertyCard keeps a fixed-height slot around it
// as the CLS floor (design-system A3).

import type { Property, Possession } from "@/lib/types";

const POSSESSION_META: Record<Possession, { label: string; dotClass: string }> = {
  ready: { label: "Ready to move", dotClass: "bg-signal-success" },
  "under-construction": { label: "Under construction", dotClass: "bg-signal-warn" },
  upcoming: { label: "Upcoming", dotClass: "bg-signal-info" },
};

export function PropertyBadge({
  property: p,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const possession = POSSESSION_META[p.possession];
  return (
    <div className={"flex items-center gap-3 text-meta-m text-text-secondary " + (className ?? "")}>
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
  );
}
