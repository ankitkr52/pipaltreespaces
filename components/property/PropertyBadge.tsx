// Status pill (possession) + optional plot-subtype badge.
// Extracted from PropertyCard's inline status row so the detail page and the
// card render the same badge; PropertyCard keeps a fixed-height slot around it
// as the CLS floor (design-system A3).

import type { Property, Possession } from "@/lib/types";

// Single source for possession copy — reused by SpecList and the detail page.
export const POSSESSION_LABEL: Record<Possession, string> = {
  ready: "Ready to move",
  "under-construction": "Under construction",
  upcoming: "Upcoming",
};

const DOT_CLASS: Record<Possession, string> = {
  ready: "bg-signal-success",
  "under-construction": "bg-signal-warn",
  upcoming: "bg-signal-info",
};

export function PropertyBadge({
  property: p,
  className,
}: {
  property: Property;
  className?: string;
}) {
  return (
    <div className={"flex items-center gap-3 text-meta-m text-text-secondary " + (className ?? "")}>
      <span className="inline-flex items-center gap-2">
        <span className={"h-2 w-2 rounded-full " + DOT_CLASS[p.possession]} aria-hidden />
        {POSSESSION_LABEL[p.possession]}
      </span>
      {p.plotSubtype && (
        <span className="text-brand-bronze">
          {p.plotSubtype === "plotted-development" ? "Plotted Development" : "Standalone"}
        </span>
      )}
    </div>
  );
}
