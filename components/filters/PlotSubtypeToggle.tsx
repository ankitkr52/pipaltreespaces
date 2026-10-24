"use client";

// All / Plotted Development / Standalone, single-select. FilterBar renders this
// only on /[city]/plotted-development.

import { Chip, ChipRail } from "@/components/filters/Chip";
import type { FilterState } from "@/lib/filters";

type Sub = FilterState["plotSubtype"];

const OPTIONS: Array<{ value: Sub; label: string }> = [
  { value: "all", label: "All" },
  { value: "plotted-development", label: "Plotted Development" },
  { value: "standalone", label: "Standalone" },
];

export function PlotSubtypeToggle({
  value,
  onChange,
}: {
  value: Sub;
  onChange: (v: Sub) => void;
}) {
  return (
    <ChipRail ariaLabel="Plot type">
      {OPTIONS.map((o) => (
        <Chip key={o.value} active={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </Chip>
      ))}
    </ChipRail>
  );
}
