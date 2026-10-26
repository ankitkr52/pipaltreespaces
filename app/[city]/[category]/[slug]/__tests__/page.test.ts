import { describe, it, expect, vi } from 'vitest';

// notFound() throws a framework sentinel in a real request; mock it so we can
// observe the call and assert on the throw.
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

import PropertyPage, { generateStaticParams } from '@/app/[city]/[category]/[slug]/page';
import { notFound } from 'next/navigation';

// Independent source of truth: every (city, category, slug) tuple in the catalogue.
// Hardcoded on purpose so the test disagrees with the code if a property is
// dropped from generateStaticParams.
const ALL_TUPLES = [
  'patna/flats-homes/boring-road-3bhk-skyline',
  'patna/flats-homes/rajendra-nagar-2bhk-greenview',
  'patna/flats-homes/patliputra-4bhk-mahaveer',
  'patna/plotted-development/danapur-plotted-greenfields',
  'patna/plotted-development/bihta-standalone-corner-plot',
  'patna/plotted-development/phulwari-sharif-plotted-sunrise',
  'patna/plotted-development/sampatchak-standalone-roadside',
  'patna/upcoming/patliputra-upcoming-vistara',
  'patna/upcoming/boring-road-upcoming-aureate',
  'pune/plotted-development/hinjewadi-plotted-aspire',
  'pune/flats/baner-3bhk-crestline',
  'pune/homes-duplex/wagholi-duplex-ironwood',
  'pune/villa/kondhwa-villa-emerald',
  'pune/penthouse/koregaon-park-penthouse-regalia',
  'gaya/plotted-development/bodhgaya-plotted-serene',
  'gaya/plotted-development/manpur-standalone-roadside',
  'gaya/flats/aiims-belt-2bhk-pankaj',
  'gaya/homes-duplex/central-gaya-duplex-tulsi',
];

describe('property page generateStaticParams', () => {
  it('pre-generates one (city, category, slug) tuple for every property', async () => {
    const params = await generateStaticParams();
    const tuples = params.map((p) => `${p.city}/${p.category}/${p.slug}`).sort();
    expect(tuples).toEqual([...ALL_TUPLES].sort());
  });
});

describe('property page notFound guard', () => {
  it('calls notFound() for an invalid city', async () => {
    await expect(
      PropertyPage({
        params: Promise.resolve({ city: 'delhi', category: 'flats-homes', slug: 'boring-road-3bhk-skyline' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound() for a category that does not exist in the city', async () => {
    // "villa" is a Pune category, not a Patna one.
    await expect(
      PropertyPage({
        params: Promise.resolve({ city: 'patna', category: 'villa', slug: 'boring-road-3bhk-skyline' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound() for an unknown slug in a valid city + category', async () => {
    await expect(
      PropertyPage({
        params: Promise.resolve({ city: 'patna', category: 'flats-homes', slug: 'does-not-exist' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
