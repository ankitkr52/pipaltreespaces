// City page — /[city] (ticket 06, US8/US9/US10).
// A buyer who picked a city sees ONLY that city's categories, each with a
// representative image + live property count, plus a breadcrumb to climb out.
// Pre-generated one-per-city at build via generateStaticParams.

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Hero } from "@/components/sections/Hero";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappHref } from "@/lib/contact";
import { getCities, getCity, getProperties } from "@/lib/data";
import type { CitySlug } from "@/lib/types";

// City hero copy (presentational; data comes from lib/data). Interim picsum
// images until Cloudinary lands (PRD §13).
const CITY_HERO: Record<CitySlug, { tagline: string }> = {
  patna: {
    tagline:
      "Flats, plotted development and upcoming launches across Patna — RERA-registered, builder-direct, filterable by budget and possession.",
  },
  pune: {
    tagline:
      "IT-corridor flats, gated plots, villas and penthouses — shortlisted on carpet area, RERA and real possession dates.",
  },
  gaya: {
    tagline:
      "AIIMS-belt plots and homes with clean, verified title — vetted for approval and possession timeline.",
  },
};

const heroImage = (slug: CitySlug) =>
  `https://picsum.photos/seed/pipaltree-cityhero-${slug}/1920/1080`;
const tileImage = (city: CitySlug, category: string) =>
  `https://picsum.photos/seed/pipaltree-cat-${city}-${category}/800/600`;

export function generateStaticParams() {
  return getCities().map((c) => ({ city: c.slug }));
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug as CitySlug);
  if (!city) notFound();

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: city.label }]} />

      <Hero
        imageUrl={heroImage(city.slug)}
        imageAlt={`Property in ${city.label}`}
        headline={`Property in ${city.label}`}
        sub={CITY_HERO[city.slug].tagline}
      />

      {/* Category tiles — only this city's categories (US8). */}
      <section className="bg-bg-base">
        <div className="mx-auto max-w-[1280px] px-4 py-16 lg:px-8 lg:py-24">
          <h2 className="font-display text-h2-m md:text-h2-d text-text-primary tracking-[-0.01em]">
            What you can buy in {city.label}
          </h2>
          <p className="mt-3 max-w-[48ch] text-body-m text-text-secondary">
            Every category below is live in {city.label} — nothing that doesn&apos;t exist here.
          </p>

          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {city.categories.map((cat) => {
              const count = getProperties({ city: city.slug, category: cat.slug }).length;
              return (
                <li key={cat.slug}>
                  <Link
                    href={`/${city.slug}/${cat.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-card border border-border-subtle bg-bg-raised shadow-lift-inner transition-colors duration-hover hover:border-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                  >
                    <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
                      <Image
                        src={tileImage(city.slug, cat.slug)}
                        alt={`${cat.label} in ${city.label}`}
                        fill
                        sizes="(min-width:1024px) 400px, (min-width:768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-hover motion-safe:group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-h3-m md:text-h3-d text-text-primary transition-colors duration-hover group-hover:text-brand-gold">
                        {cat.label}
                      </h3>
                      <p className="mt-2 text-meta-m md:text-meta-d text-text-secondary">
                        {count > 0
                          ? `${count} ${count === 1 ? "property" : "properties"}`
                          : "Updating soon"}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Closing WhatsApp CTA (PRD §7 city page). */}
      <section className="bg-bg-sunken">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center px-4 py-16 text-center lg:px-8 lg:py-24">
          <h2 className="font-display text-h2-m md:text-h2-d text-text-primary tracking-[-0.01em] max-w-[24ch]">
            Not sure which {city.label} category fits you?
          </h2>
          <p className="mt-4 max-w-[46ch] text-body-m text-text-secondary">
            Tell the advisor your budget and timeline — get a shortlist back, no scrolling required.
          </p>
          <div className="mt-8">
            <Button
              as="a"
              href={whatsappHref()}
              target="_blank"
              rel="noopener"
              className="px-7"
              leading={<WhatsAppIcon className="h-5 w-5" />}
            >
              Talk to the advisor
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
