import type { Property } from '@/lib/types';

export const base: Omit<Property, 'id' | 'slug' | 'createdAt'> = {
  title: 'Test Property',
  city: 'patna',
  category: 'flats-homes',
  kind: 'residential',
  location: { locality: 'Boring Road', address: 'Boring Road, Patna', landmarks: [] },
  priceType: 'range',
  priceMin: 5000000,
  priceMax: 7500000,
  area: { value: 1200, unit: 'sqft' },
  bhk: 3,
  possession: 'ready',
  rera: 'RERA-BR-123',
  builder: { name: 'Test Builder' },
  amenities: [],
  images: Array.from({ length: 6 }, (_, i) => `https://res.cloudinary.com/x/${i}.jpg`),
  description: 'nice',
  highlights: [],
};

export const p = (overrides: Partial<Property>): Property => ({
  ...base,
  id: 'id',
  slug: 'slug',
  createdAt: '2026-01-01',
  ...overrides,
});

export const fixtures: Property[] = [
  // Patna / flats-homes — 3 entries, newest-featured first
  p({ id: 'pa-fh-1', slug: 'a', city: 'patna', category: 'flats-homes', featured: true, createdAt: '2026-03-01' }),
  p({ id: 'pa-fh-2', slug: 'b', city: 'patna', category: 'flats-homes', featured: false, createdAt: '2026-05-01' }),
  p({ id: 'pa-fh-3', slug: 'c', city: 'patna', category: 'flats-homes', featured: true, createdAt: '2026-01-15' }),
  // Patna / flats-homes — Price on Request
  p({
    id: 'pa-fh-por',
    slug: 'por',
    city: 'patna',
    category: 'flats-homes',
    priceType: 'on-request',
    priceMin: undefined,
    priceMax: undefined,
    featured: false,
    createdAt: '2026-02-10',
  }),
  // Patna / plotted-development (different category, same city)
  p({
    id: 'pa-pd-1',
    slug: 'd',
    city: 'patna',
    category: 'plotted-development',
    kind: 'plot',
    bhk: undefined,
    plotSubtype: 'plotted-development',
    dimensions: '30x40',
    area: { value: 1200, unit: 'sqyd' },
    createdAt: '2026-04-01',
  }),
  // Pune / flats-homes (different city)
  p({ id: 'pu-fh-1', slug: 'e', city: 'pune', category: 'flats-homes', featured: true, createdAt: '2026-06-01' }),
];
