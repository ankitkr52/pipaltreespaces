// Single read seam for all content. Pages and components must import from here,
// never from /data/*.json directly. Zod parses once at module load; schema drift
// throws at build time, not at page render.
import { z } from 'zod';
import rawProperties from '@/data/properties.json';
import rawTestimonials from '@/data/testimonials.json';
import { CITIES, getCity as cityBySlug, getCategory } from '@/data/cities';
import { PropertySchema, TestimonialSchema } from '@/lib/validators';
import type { Property, Testimonial, CityConfig, CitySlug, CategorySlug } from '@/lib/types';

const PROPERTIES: Property[] = z.array(PropertySchema).parse(rawProperties) as Property[];
const TESTIMONIALS: Testimonial[] = z.array(TestimonialSchema).parse(rawTestimonials) as Testimonial[];

const byCreatedDesc = (a: { createdAt: string }, b: { createdAt: string }) =>
  b.createdAt.localeCompare(a.createdAt);

const byFeaturedThenCreatedDesc = (a: Property, b: Property) => {
  const af = a.featured ? 1 : 0;
  const bf = b.featured ? 1 : 0;
  if (af !== bf) return bf - af;
  return byCreatedDesc(a, b);
};

export function getCities(): CityConfig[] {
  return CITIES;
}

export function getCity(slug: CitySlug): CityConfig | undefined {
  return cityBySlug(slug);
}

export { getCategory };

export interface PropertyFilter {
  city?: CitySlug;
  category?: CategorySlug;
}

export function getProperties(filter?: PropertyFilter): Property[] {
  if (!filter) return PROPERTIES;
  return PROPERTIES.filter(
    (p) => (!filter.city || p.city === filter.city) && (!filter.category || p.category === filter.category),
  );
}

export function getProperty(
  city: CitySlug,
  category: CategorySlug,
  slug: string,
): Property | undefined {
  return PROPERTIES.find((p) => p.city === city && p.category === category && p.slug === slug);
}

export function getFeaturedProperties(limit = 6): Property[] {
  return PROPERTIES.filter((p) => p.featured).sort(byCreatedDesc).slice(0, limit);
}

// Similar Properties rule (GLOSSARY, PRD §6.1): same city + same category,
// exclude current, sort featured desc then createdAt desc, cap at limit.
export function getSimilarProperties(current: Property, limit = 3): Property[] {
  return PROPERTIES.filter(
    (p) => p.id !== current.id && p.city === current.city && p.category === current.category,
  )
    .sort(byFeaturedThenCreatedDesc)
    .slice(0, limit);
}

// Price-on-Request group (PRD §6.1): filters to on-request, bypasses price
// filtering upstream, sorted featured desc then createdAt desc.
export function getPriceOnRequestGroup(filtered: Property[]): Property[] {
  return filtered.filter((p) => p.priceType === 'on-request').sort(byFeaturedThenCreatedDesc);
}

export function getTestimonials(filter?: { featured?: boolean }): Testimonial[] {
  let out = TESTIMONIALS.slice().sort(byCreatedDesc);
  if (filter?.featured !== undefined) out = out.filter((t) => Boolean(t.featured) === filter.featured);
  return out;
}
