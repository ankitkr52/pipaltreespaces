import { describe, it, expect, vi } from 'vitest';

// notFound() throws a framework sentinel in a real request; mock it so we can
// observe the call and assert on the throw.
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

import CategoryPage, { generateStaticParams } from '@/app/[city]/[category]/page';
import { notFound } from 'next/navigation';

describe('category page generateStaticParams', () => {
  it('pre-generates each city crossed with its OWN categories', async () => {
    const params = await generateStaticParams();
    const pairs = params.map((p) => `${p.city}/${p.category}`).sort();
    expect(pairs).toEqual(
      [
        'patna/flats-homes',
        'patna/plotted-development',
        'patna/upcoming',
        'pune/plotted-development',
        'pune/flats',
        'pune/homes-duplex',
        'pune/villa',
        'pune/penthouse',
        'gaya/plotted-development',
        'gaya/flats',
        'gaya/homes-duplex',
      ].sort(),
    );
  });
});

describe('category page notFound guard', () => {
  it('calls notFound() for a category that does not exist in the city', async () => {
    // "villa" is a Pune category, not a Patna one.
    await expect(
      CategoryPage({ params: Promise.resolve({ city: 'patna', category: 'villa' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
