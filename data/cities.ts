import type { CategoryConfig, CityConfig, CitySlug, CategorySlug } from '@/lib/types';

const flatsHomes: CategoryConfig = { slug: 'flats-homes', label: 'Flats & Homes', kind: 'residential' };
const flats: CategoryConfig = { slug: 'flats', label: 'Flats', kind: 'residential' };
const homesDuplex: CategoryConfig = { slug: 'homes-duplex', label: 'Homes & Duplex', kind: 'residential' };
const villa: CategoryConfig = { slug: 'villa', label: 'Villas', kind: 'residential' };
const penthouse: CategoryConfig = { slug: 'penthouse', label: 'Penthouses', kind: 'residential' };
const plottedDevelopment: CategoryConfig = {
  slug: 'plotted-development',
  label: 'Plotted Development & Standalone Plots',
  kind: 'plot',
};
const upcoming: CategoryConfig = { slug: 'upcoming', label: 'Upcoming Projects', kind: 'residential' };

export const CITIES: CityConfig[] = [
  {
    slug: 'patna',
    label: 'Patna',
    categories: [flatsHomes, plottedDevelopment, upcoming],
  },
  {
    slug: 'pune',
    label: 'Pune',
    categories: [plottedDevelopment, flats, homesDuplex, villa, penthouse],
  },
  {
    slug: 'gaya',
    label: 'Gaya',
    categories: [plottedDevelopment, flats, homesDuplex],
  },
];

export const SEO_INTROS: Record<CitySlug, Partial<Record<CategorySlug, string>>> = {
  patna: {
    'flats-homes':
      'Flats and homes in Patna, from Boring Road high-rises to Rajendra Nagar duplexes. RERA-registered, builder-direct, with pricing you can actually filter.',
    'plotted-development':
      'Plotted developments and standalone plots across Patna — Danapur, Bihta, Phulwari Sharif. Approved layouts, clean title, and ready-to-register options.',
    upcoming:
      'Upcoming Patna projects — pre-launch flats and layouts you can block before the public price list drops. Updated as new approvals land.',
  },
  pune: {
    'plotted-development':
      'Plotted developments and standalone plots in Pune — Hinjewadi, Wagholi, Chakan. Approved layouts, infrastructure-ready, with per-plot pricing.',
    flats: 'Flats across Pune — IT corridor, PCMC, central Pune. Shortlisted on RERA, carpet area, and real possession dates.',
    'homes-duplex':
      'Homes and duplexes in Pune, picked for livable floor plans and settled neighbourhoods. Independent construction, no clubhouse maintenance.',
    villa: 'Villas in Pune — gated communities and standalone, each with land title and amenity scope you can verify.',
    penthouse: 'Pune penthouses — top-floor, large terraces, premium belts of Baner, Kalyani Nagar, Koregaon Park.',
  },
  gaya: {
    'plotted-development':
      'Plotted developments and standalone plots in Gaya — Bodhgaya, Manpur, AIIMS belt. Approved layouts with clear title.',
    flats: 'Flats in Gaya — AIIMS neighbourhood, central Gaya, and emerging arterial roads. Vetted for RERA and possession timeline.',
    'homes-duplex': 'Homes and duplexes in Gaya for buyers who want land + build over flat ownership. Walk-throughs on request.',
  },
};

export function getCity(slug: CitySlug): CityConfig | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getCategory(citySlug: CitySlug, categorySlug: CategorySlug): CategoryConfig | undefined {
  return getCity(citySlug)?.categories.find((c) => c.slug === categorySlug);
}
