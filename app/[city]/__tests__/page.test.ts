import { describe, it, expect, vi } from 'vitest';

// notFound() in a real request throws a framework sentinel; mock it so we can
// both observe the call and get a throw to assert against.
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

import CityPage, { generateStaticParams } from '@/app/[city]/page';
import { notFound } from 'next/navigation';

describe('city page generateStaticParams', () => {
  it('pre-generates exactly the three city slugs', async () => {
    const params = await generateStaticParams();
    expect(params.map((p) => p.city).sort()).toEqual(['gaya', 'patna', 'pune']);
  });
});

describe('city page notFound guard', () => {
  it('calls notFound() for an unknown city slug', async () => {
    await expect(
      CityPage({ params: Promise.resolve({ city: 'mumbai' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
