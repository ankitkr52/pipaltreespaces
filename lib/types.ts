// Pipaltreespaces — shared types (PRD §8)
// Keep in sync with /data/cities.ts, /data/properties.json, /data/testimonials.json.

export type CitySlug = "patna" | "pune" | "gaya";

export type CategorySlug =
  | "flats-homes"
  | "plotted-development"
  | "upcoming"
  | "flats"
  | "homes-duplex"
  | "villa"
  | "penthouse";

export interface CategoryConfig {
  slug: CategorySlug;
  label: string;
  kind: "residential" | "plot";
}

export interface CityConfig {
  slug: CitySlug;
  label: string;
  categories: CategoryConfig[];
}

export type Possession = "ready" | "under-construction" | "upcoming";

export interface Property {
  id: string;
  slug: string;
  title: string;
  city: CitySlug;
  category: CategorySlug;
  kind: "residential" | "plot";
  plotSubtype?: "plotted-development" | "standalone";

  location: {
    locality: string;
    address: string;
    landmarks: string[];
    lat?: number;
    lng?: number;
  };

  priceType: "range" | "on-request";
  priceMin?: number;
  priceMax?: number;

  area: { value: number; unit: "sqft" | "sqyd" };

  bhk?: 1 | 2 | 3 | 4 | 5;
  floor?: string;
  dimensions?: string;
  approvalType?: string;

  possession: Possession;
  possessionDate?: string;
  rera: string;

  builder: { name: string; about?: string };
  amenities: string[];
  images: string[];
  description: string;
  highlights: string[];

  disclaimer?: string;
  ogImage?: string;

  featured?: boolean;
  createdAt: string;
  tags?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  locality: string;
  cityOfInterest: CitySlug;
  quoteTitle: string;
  quoteBody: string;
  avatarType: "initials" | "photo";
  avatarUrl?: string;
  consentOnFile?: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  featured?: boolean;
  createdAt: string;
}
