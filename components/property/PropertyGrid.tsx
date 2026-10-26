// Runs the pure filter engine over the full list and lays out the result:
// matched properties in a responsive grid (or an EmptyState), with the
// Price-on-Request group always below under its own heading (§6.1).

import { applyFilters, type FilterState } from "@/lib/filters";
import type { Property } from "@/lib/types";
import { PropertyCard } from "@/components/property/PropertyCard";
import { EmptyState } from "@/components/ui/EmptyState";

function Grid({ items }: { items: Property[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <li key={p.id}>
          <PropertyCard property={p} />
        </li>
      ))}
    </ul>
  );
}

export function PropertyGrid({
  properties,
  state,
  onClear,
}: {
  properties: Property[];
  state: FilterState;
  onClear?: () => void;
}) {
  const { matched, priceOnRequest } = applyFilters(properties, state);

  return (
    <div className="space-y-12">
      {matched.length > 0 ? <Grid items={matched} /> : <EmptyState onClear={onClear} />}

      {priceOnRequest.length > 0 && (
        <section>
          <h2 className="font-display text-h3-m md:text-h3-d text-text-primary">Price on Request</h2>
          <p className="mt-2 mb-6 text-meta-m md:text-meta-d text-text-secondary">
            Priced on enquiry — shown regardless of the budget band above.
          </p>
          <Grid items={priceOnRequest} />
        </section>
      )}
    </div>
  );
}
