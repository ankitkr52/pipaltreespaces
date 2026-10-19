import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixtures } from './fixtures/properties';
import { testimonials } from './fixtures/testimonials';

vi.mock('@/data/properties.json', () => ({ default: fixtures }));
vi.mock('@/data/testimonials.json', () => ({ default: testimonials }));

import {
  getCities,
  getCity,
  getProperties,
  getProperty,
  getFeaturedProperties,
  getSimilarProperties,
  getPriceOnRequestGroup,
  getTestimonials,
} from '@/lib/data';

describe('getCities / getCity', () => {
  it('returns all three cities', () => {
    expect(getCities().map((c) => c.slug).sort()).toEqual(['gaya', 'patna', 'pune']);
  });

  it('returns undefined for unknown slug', () => {
    // @ts-expect-error — testing runtime guard
    expect(getCity('mumbai')).toBeUndefined();
  });

  it('returns city config for a known slug', () => {
    expect(getCity('patna')?.label).toBe('Patna');
  });
});

describe('getProperties / getProperty', () => {
  it('returns the full catalogue', () => {
    expect(getProperties()).toHaveLength(fixtures.length);
  });

  it('filters by city', () => {
    expect(getProperties({ city: 'pune' })).toHaveLength(1);
  });

  it('filters by category', () => {
    expect(getProperties({ city: 'patna', category: 'flats-homes' })).toHaveLength(4);
  });

  it('getProperty returns undefined on miss', () => {
    expect(getProperty('patna', 'flats-homes', 'nope')).toBeUndefined();
  });

  it('getProperty returns the match', () => {
    expect(getProperty('patna', 'flats-homes', 'a')?.id).toBe('pa-fh-1');
  });
});

describe('getFeaturedProperties', () => {
  it('returns only featured, newest first, capped at limit', () => {
    const r = getFeaturedProperties(2);
    expect(r).toHaveLength(2);
    expect(r[0].createdAt >= r[1].createdAt).toBe(true);
    expect(r.every((p) => p.featured)).toBe(true);
  });
});

describe('getSimilarProperties', () => {
  it('same city + same category, excluding current, featured desc then createdAt desc, capped', () => {
    const current = getProperty('patna', 'flats-homes', 'a')!;
    const r = getSimilarProperties(current, 3);
    expect(r.map((p) => p.id)).toEqual(['pa-fh-3', 'pa-fh-2', 'pa-fh-por']);
    // pa-fh-3 is featured (sorts above the two non-featured regardless of date)
  });

  it('caps at limit', () => {
    const current = getProperty('patna', 'flats-homes', 'a')!;
    expect(getSimilarProperties(current, 1)).toHaveLength(1);
  });

  it('returns [] when nothing matches', () => {
    const current = getProperty('pune', 'flats-homes', 'e')!;
    expect(getSimilarProperties(current, 3)).toEqual([]);
  });
});

describe('getPriceOnRequestGroup', () => {
  it('filters to on-request and sorts', () => {
    const all = getProperties({ city: 'patna', category: 'flats-homes' });
    const r = getPriceOnRequestGroup(all);
    expect(r.map((p) => p.id)).toEqual(['pa-fh-por']);
  });
});

describe('getTestimonials', () => {
  it('returns testimonials sorted by createdAt desc', () => {
    const r = getTestimonials();
    expect(r).toHaveLength(2);
    expect(r[0].id).toBe('t2');
  });

  it('filters by featured', () => {
    expect(getTestimonials({ featured: true }).map((t) => t.id)).toEqual(['t1']);
  });
});
