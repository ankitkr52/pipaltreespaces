// Pure filter engine. Zero React/Next imports — SSR-safe, jsdom-free.
// Keep in sync with `components/filters/useFilterUrl.ts` which owns URL state.
import type { Property, Possession, CategorySlug } from '@/lib/types';

export type PriceBand = '20-50L' | '50L-1Cr' | '1Cr+';

export interface FilterState {
  category: CategorySlug;
  priceBand: PriceBand | null;
  bhk: Array<1 | 2 | 3 | 4 | 5>;
  possession: Possession[];
  plotSubtype: 'all' | 'plotted-development' | 'standalone';
}

const BAND: Record<PriceBand, [number, number]> = {
  '20-50L': [2_000_000, 5_000_000],
  '50L-1Cr': [5_000_000, 10_000_000],
  '1Cr+': [10_000_000, Number.POSITIVE_INFINITY],
};

function inBand(p: Property, band: PriceBand): boolean {
  if (p.priceType !== 'range' || p.priceMin == null || p.priceMax == null) return false;
  const [lo, hi] = BAND[band];
  return p.priceMin <= hi && p.priceMax >= lo;
}

export function applyFilters(
  properties: Property[],
  state: FilterState,
): { matched: Property[]; priceOnRequest: Property[] } {
  const isPlotCategory = state.category === 'plotted-development';

  const nonPrice = properties.filter((p) => {
    if (state.possession.length && !state.possession.includes(p.possession)) return false;
    if (!isPlotCategory && state.bhk.length && (p.bhk == null || !state.bhk.includes(p.bhk))) return false;
    if (
      isPlotCategory &&
      state.plotSubtype !== 'all' &&
      p.plotSubtype !== state.plotSubtype
    )
      return false;
    return true;
  });

  const priceOnRequest = nonPrice.filter((p) => p.priceType === 'on-request');
  const ranged = nonPrice.filter((p) => p.priceType === 'range');
  const matched = state.priceBand ? ranged.filter((p) => inBand(p, state.priceBand!)) : ranged;

  return { matched, priceOnRequest };
}
