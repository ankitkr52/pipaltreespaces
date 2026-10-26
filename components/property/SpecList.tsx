// Key spec grid. Switches on `kind`: residential surfaces BHK + floor,
// plot surfaces dimensions + approval. Common rows (area, possession, RERA,
// builder) show for both.

import type { Property } from "@/lib/types";
import { formatArea } from "@/lib/format";

const POSSESSION_LABEL: Record<Property["possession"], string> = {
  ready: "Ready to move",
  "under-construction": "Under construction",
  upcoming: "Upcoming",
};

export function SpecList({ property: p }: { property: Property }) {
  const rows: Array<[string, string]> = [];

  if (p.kind === "residential") {
    if (p.bhk) rows.push(["Configuration", `${p.bhk} BHK`]);
    if (p.floor) rows.push(["Floor", p.floor]);
  } else {
    if (p.dimensions) rows.push(["Dimensions", p.dimensions]);
    if (p.approvalType) rows.push(["Approval", p.approvalType]);
  }

  rows.push(["Area", formatArea(p)]);
  rows.push(["Possession", POSSESSION_LABEL[p.possession]]);
  rows.push(["RERA", p.rera]);
  rows.push(["Builder", p.builder.name]);

  return (
    <section aria-labelledby="specs-heading">
      <h2 id="specs-heading" className="font-display text-h3-m md:text-h3-d text-text-primary tracking-[-0.01em]">
        Specifications
      </h2>
      <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between border-b border-border-subtle pb-2">
            <dt className="text-meta-d text-text-secondary">{label}</dt>
            <dd className="text-body-m text-text-primary tabular-nums text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
