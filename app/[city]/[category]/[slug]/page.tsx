// Property detail — /[city]/[category]/[slug]. The lead-conversion surface.
// Server component: resolves city+category (404 on miss) then the property
// (404 on unknown slug), and composes the gallery, fundamentals, specs,
// "why buy", rate disclaimer, desktop callback and similar properties.
// The mobile sticky WhatsApp+Call bar is mounted site-wide in app/layout.tsx
// and is property-aware there, so it is not re-rendered here.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Gallery } from "@/components/property/Gallery";
import { SpecList } from "@/components/property/SpecList";
import { WhyBuy } from "@/components/property/WhyBuy";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { PropertyBadge, POSSESSION_LABEL } from "@/components/property/PropertyBadge";
import { RateDisclaimer } from "@/components/ui/RateDisclaimer";
import { CallbackForm } from "@/components/forms/CallbackForm";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { getProperties, getProperty, getCategory, getCity } from "@/lib/data";
import { whatsappHref } from "@/lib/contact";
import { formatPrice, formatArea } from "@/lib/format";
import type { CitySlug, CategorySlug } from "@/lib/types";

export function generateStaticParams() {
  return getProperties().map((p) => ({ city: p.city, category: p.category, slug: p.slug }));
}

type PageParams = { city: string; category: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { city, category, slug } = await params;
  const property = getProperty(city as CitySlug, category as CategorySlug, slug);
  if (!property) return {};
  // Minimal title; ticket 11 owns the full SEO/OG treatment.
  return { title: property.title, description: property.description };
}

export default async function PropertyPage({ params }: { params: Promise<PageParams> }) {
  const { city: citySlug, category: categorySlug, slug } = await params;

  const category = getCategory(citySlug as CitySlug, categorySlug as CategorySlug);
  if (!category) notFound();

  const city = getCity(citySlug as CitySlug)!;
  const property = getProperty(citySlug as CitySlug, categorySlug as CategorySlug, slug);
  if (!property) notFound();

  return (
    <>
      <Breadcrumb
        trail={[
          { label: "Home", href: "/" },
          { label: city.label, href: `/${city.slug}` },
          { label: category.label, href: `/${city.slug}/${category.slug}` },
          { label: property.title },
        ]}
      />

      {/* Above the fold: gallery + fundamentals side-by-side on desktop */}
      <div className="mx-auto max-w-[1280px] px-4 pt-6 lg:px-8 lg:pt-8">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <Gallery images={property.images} title={property.title} locality={property.location.locality} />

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <PropertyBadge property={property} />

            <h1 className="mt-3 font-display text-h1-m md:text-h2-d text-text-primary tracking-[-0.01em]">
              {property.title}
            </h1>

            <p className="mt-2 text-body-m text-text-secondary">{property.location.locality}</p>

            <p className="mt-4 font-display text-h2-m md:text-h2-d tabular-nums text-brand-gold">
              {formatPrice(property)}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border-subtle pt-5">
              <Fundamental label="Size" value={formatArea(property)} />
              <Fundamental label="Possession" value={POSSESSION_LABEL[property.possession]} />
              <Fundamental label="RERA" value={property.rera} />
              <Fundamental label="Builder" value={property.builder.name} />
            </dl>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                as="a"
                href={whatsappHref(property)}
                variant="primary"
                target="_blank"
                rel="noopener"
                leading={<WhatsAppIcon className="h-5 w-5" />}
              >
                WhatsApp about this property
              </Button>
              {/* Desktop fallback path — anchors to the callback section below */}
              <Button as="a" href="#request-callback" variant="secondary" className="hidden lg:inline-flex">
                Request a callback
              </Button>
            </div>

            <RateDisclaimer className="mt-4" />
          </aside>
        </div>
      </div>

      {/* Specs + amenities + why-buy */}
      <div className="mx-auto max-w-[1280px] px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <SpecList property={property} />

          {property.amenities.length > 0 && (
            <section aria-labelledby="amenities-heading">
              <h2
                id="amenities-heading"
                className="font-display text-h3-m md:text-h3-d text-text-primary tracking-[-0.01em]"
              >
                Amenities
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <li
                    key={a}
                    className="rounded-full border border-border-subtle bg-bg-raised px-3 py-1.5 text-meta-d text-text-secondary"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="mt-12">
          <WhyBuy property={property} />
        </div>

        {/* Desktop Request Callback section (sticky-bar covers mobile) */}
        <section
          id="request-callback"
          aria-labelledby="callback-heading"
          className="mt-16 hidden scroll-mt-24 rounded-card border border-border-subtle bg-bg-raised p-8 lg:block"
        >
          <h2
            id="callback-heading"
            className="font-display text-h3-d text-text-primary tracking-[-0.01em]"
          >
            Request a callback
          </h2>
          <p className="mt-2 text-body-m text-text-secondary">
            Prefer a call? Share your details and the advisor will reach out about {property.title}.
          </p>
          <div className="mt-6 max-w-md">
            <CallbackForm />
          </div>
        </section>
      </div>

      <SimilarProperties current={property} />
    </>
  );
}

function Fundamental({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-meta-d text-text-secondary">{label}</dt>
      <dd className="mt-0.5 text-body-m text-text-primary tabular-nums">{value}</dd>
    </div>
  );
}
