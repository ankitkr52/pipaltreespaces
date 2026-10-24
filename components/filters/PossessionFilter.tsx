"use client";

// Possession status chips, multi-select.

import { Chip, ChipRail } from "@/components/filters/Chip";
import type { Possession } from "@/lib/types";

const OPTIONS: Array<{ value: Possession; label: string }> = [
  { value: "ready", label: "Ready to move" },
  { value: "under-construction", label: "Under construction" },
  { value: "upcoming", label: "Upcoming" },
];

export function PossessionFilter({
  value,
  onToggle,
}: {
  value: Possession[];
  onToggle: (v: Possession) => void;
}) {
  return (
    <ChipRail ariaLabel="Possession">
      {OPTIONS.map((o) => (
        <Chip key={o.value} active={value.includes(o.value)} onClick={() => onToggle(o.value)}>
          {o.label}
        </Chip>
      ))}
    </ChipRail>
  );
}
