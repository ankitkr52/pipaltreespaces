// Category listing page — /[city]/[category] (ticket 07, the site's engine).
// Server component: resolves the category (404 on miss), fetches the full
// property list for this city+category, and hands it to the client FilterBar
// which owns filter state and the grid. Pre-generated per city × its OWN
// categories (cities carry different category lists).

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FilterBar } from "@/components/filters/FilterBar";
import { GridSkeleton } from "@/components/ui/GridSkeleton";
import { getCities, getCity, getCategory, getProperties } from "@/lib/data";
import { SEO_INTROS } from "@/data/cities";
import type { CitySlug, CategorySlug } from "@/lib/types";

export function generateStaticParams() {
  return getCities().flatMap((c) => c.categories.map((cat) => ({ city: c.slug, category: cat.slug })));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ city: string; category: string }>;
}) {
  const { city: citySlug, category: categorySlug } = await params;
  const category = getCategory(citySlug as CitySlug, categorySlug as CategorySlug);
  if (!category) notFound();

  // A resolved category implies a resolved city.
  const city = getCity(citySlug as CitySlug)!;
  const properties = getProperties({ city: city.slug, category: category.slug });
  const intro = SEO_INTROS[city.slug]?.[category.slug];

  return (
    <>
      <Breadcrumb
        trail={[
          { label: "Home", href: "/" },
          { label: city.label, href: `/${city.slug}` },
          { label: category.label },
        ]}
      />

      <header className="bg-bg-base">
        <div className="mx-auto max-w-[1280px] px-4 pt-8 lg:px-8 lg:pt-12">
          <h1 className="font-display text-h1-m md:text-h1-d text-text-primary tracking-[-0.01em]">
            {category.label} in {city.label}
          </h1>
          {intro && <p className="mt-4 max-w-[60ch] text-body-m text-text-secondary">{intro}</p>}
        </div>
      </header>

      {/* FilterBar reads the URL via useSearchParams — a Suspense boundary is
          required so the page can still be statically generated. */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-8 lg:py-12">
            <GridSkeleton />
          </div>
        }
      >
        <FilterBar
          city={city.slug}
          category={category}
          categories={city.categories}
          properties={properties}
        />
      </Suspense>
    </>
  );
}
