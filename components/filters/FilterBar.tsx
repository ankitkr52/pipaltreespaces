"use client";

// Client filter shell: owns the URL-synced FilterState (useFilterUrl) and drives
// PropertyGrid. BHKFilter is dropped on plot categories; PlotSubtypeToggle shows
// only on plotted-development. Dispatches run inside a transition so the grid can
// show GridSkeleton while a change is pending.

import { useTransition } from "react";
import { useFilterUrl } from "@/components/filters/useFilterUrl";
import { CategorySwitcher } from "@/components/filters/CategorySwitcher";
import { PriceBand } from "@/components/filters/PriceBand";
import { BHKFilter } from "@/components/filters/BHKFilter";
import { PossessionFilter } from "@/components/filters/PossessionFilter";
import { PlotSubtypeToggle } from "@/components/filters/PlotSubtypeToggle";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { GridSkeleton } from "@/components/ui/GridSkeleton";
import type { CategoryConfig, CitySlug, Property } from "@/lib/types";

export function FilterBar({
  city,
  category,
  categories,
  properties,
}: {
  city: CitySlug;
  category: CategoryConfig;
  categories: CategoryConfig[];
  properties: Property[];
}) {
  const { state, dispatch } = useFilterUrl(category.slug);
  const [isPending, startTransition] = useTransition();
  const act = (action: Parameters<typeof dispatch>[0]) =>
    startTransition(() => dispatch(action));

  const isPlot = category.kind === "plot";

  return (
    <section className="bg-bg-base">
      <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-8 lg:py-12">
        <div className="space-y-4">
          <CategorySwitcher city={city} current={category.slug} categories={categories} />

          <div className="flex flex-col gap-3">
            <PriceBand value={state.priceBand} onChange={(band) => act({ type: "setPriceBand", band })} />
            {!isPlot && (
              <BHKFilter value={state.bhk} onToggle={(v) => act({ type: "toggleBhk", value: v })} />
            )}
            <PossessionFilter
              value={state.possession}
              onToggle={(v) => act({ type: "togglePossession", value: v })}
            />
            {category.slug === "plotted-development" && (
              <PlotSubtypeToggle
                value={state.plotSubtype}
                onChange={(v) => act({ type: "setPlotSubtype", value: v })}
              />
            )}
          </div>
        </div>

        <div className="mt-10">
          {isPending ? (
            <GridSkeleton />
          ) : (
            <PropertyGrid
              properties={properties}
              state={state}
              onClear={() => act({ type: "reset" })}
            />
          )}
        </div>
      </div>
    </section>
  );
}
