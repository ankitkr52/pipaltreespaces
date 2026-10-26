"use client";

// Sibling-category chip rail. Composes Chip/ChipRail (scroll fade + arrow nav
// live there). Each chip navigates to /[city]/[slug]; the active one is pressed.

import { useRouter } from "next/navigation";
import { Chip, ChipRail } from "@/components/filters/Chip";
import type { CategoryConfig, CitySlug, CategorySlug } from "@/lib/types";

export function CategorySwitcher({
  city,
  current,
  categories,
}: {
  city: CitySlug;
  current: CategorySlug;
  categories: CategoryConfig[];
}) {
  const router = useRouter();
  return (
    <ChipRail ariaLabel="Categories">
      {categories.map((cat) => (
        <Chip
          key={cat.slug}
          active={cat.slug === current}
          onClick={() => router.push(`/${city}/${cat.slug}`)}
        >
          {cat.label}
        </Chip>
      ))}
    </ChipRail>
  );
}
