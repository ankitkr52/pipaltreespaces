// Up to 3 similar properties (same city + category, excl. current). Hides
// itself when the data layer returns none.

import { getSimilarProperties } from "@/lib/data";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { Property } from "@/lib/types";

export function SimilarProperties({ current }: { current: Property }) {
  const similar = getSimilarProperties(current, 3);
  if (similar.length === 0) return null;

  return (
    <section aria-labelledby="similar-heading" className="bg-bg-base">
      <div className="mx-auto max-w-[1280px] px-4 py-16 lg:px-8 lg:py-28">
        <h2 id="similar-heading" className="font-display text-h2-m md:text-h2-d text-text-primary tracking-[-0.01em]">
          Similar properties
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
