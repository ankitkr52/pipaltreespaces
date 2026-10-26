"use client";

// Three preset budget bands, single-select. Clicking the active band clears it.

import { Chip, ChipRail } from "@/components/filters/Chip";
import type { PriceBand as Band } from "@/lib/filters";

const BANDS: Array<{ value: Band; label: string }> = [
  { value: "20-50L", label: "₹20–50L" },
  { value: "50L-1Cr", label: "₹50L–1Cr" },
  { value: "1Cr+", label: "₹1Cr+" },
];

export function PriceBand({
  value,
  onChange,
}: {
  value: Band | null;
  onChange: (band: Band | null) => void;
}) {
  return (
    <ChipRail ariaLabel="Budget">
      {BANDS.map((b) => (
        <Chip key={b.value} active={value === b.value} onClick={() => onChange(value === b.value ? null : b.value)}>
          {b.label}
        </Chip>
      ))}
    </ChipRail>
  );
}
