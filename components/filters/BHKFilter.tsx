"use client";

// 1–5 BHK chips, multi-select. FilterBar omits this whole control on plot
// categories, so it never needs to know about `kind` itself.

import { Chip, ChipRail } from "@/components/filters/Chip";

const BHKS: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

export function BHKFilter({
  value,
  onToggle,
}: {
  value: Array<1 | 2 | 3 | 4 | 5>;
  onToggle: (bhk: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <ChipRail ariaLabel="Bedrooms">
      {BHKS.map((n) => (
        <Chip key={n} active={value.includes(n)} onClick={() => onToggle(n)}>
          {n} BHK
        </Chip>
      ))}
    </ChipRail>
  );
}
