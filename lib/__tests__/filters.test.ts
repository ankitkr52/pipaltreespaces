// @vitest-environment node
// Pure applyFilters — zero React/Next imports, runs in node.
import { describe, it, expect } from 'vitest';
import { applyFilters, type FilterState } from '@/lib/filters';
import { p } from './fixtures/properties';

const state = (overrides: Partial<FilterState> = {}): FilterState => ({
  category: 'flats-homes',
  priceBand: null,
  bhk: [],
  possession: [],
  plotSubtype: 'all',
  ...overrides,
});

describe('applyFilters', () => {
  it('(a) BHK filter excludes non-matching residential records', () => {
    const props = [
      p({ id: '1', bhk: 2 }),
      p({ id: '2', bhk: 3 }),
      p({ id: '3', bhk: 4 }),
    ];
    const result = applyFilters(props, state({ bhk: [2, 3] }));
    expect(result.matched.map((x) => x.id).sort()).toEqual(['1', '2']);
    expect(result.priceOnRequest).toEqual([]);
  });

  it('(b) possession multi-select unions matches', () => {
    const props = [
      p({ id: 'r', possession: 'ready' }),
      p({ id: 'u', possession: 'under-construction' }),
      p({ id: 'f', possession: 'upcoming' }),
    ];
    const result = applyFilters(props, state({ possession: ['ready', 'under-construction'] }));
    expect(result.matched.map((x) => x.id).sort()).toEqual(['r', 'u']);
  });

  it('(c) PoR properties surface in priceOnRequest group regardless of price band', () => {
    const props = [
      p({ id: 'range-lo', priceType: 'range', priceMin: 2_500_000, priceMax: 4_000_000 }),
      p({ id: 'range-hi', priceType: 'range', priceMin: 20_000_000, priceMax: 30_000_000 }),
      p({ id: 'por', priceType: 'on-request', priceMin: undefined, priceMax: undefined }),
    ];
    const result = applyFilters(props, state({ priceBand: '20-50L' }));
    expect(result.matched.map((x) => x.id)).toEqual(['range-lo']);
    expect(result.priceOnRequest.map((x) => x.id)).toEqual(['por']);
  });

  it('(d) plotted-development + plotSubtype=standalone narrows', () => {
    const props = [
      p({
        id: 'pd',
        category: 'plotted-development',
        kind: 'plot',
        bhk: undefined,
        plotSubtype: 'plotted-development',
      }),
      p({
        id: 'sa',
        category: 'plotted-development',
        kind: 'plot',
        bhk: undefined,
        plotSubtype: 'standalone',
      }),
    ];
    const result = applyFilters(
      props,
      state({ category: 'plotted-development', plotSubtype: 'standalone' }),
    );
    expect(result.matched.map((x) => x.id)).toEqual(['sa']);
  });

  it('(e) empty result returns {matched:[], priceOnRequest:[]}', () => {
    const props = [p({ id: '1', bhk: 2 })];
    const result = applyFilters(props, state({ bhk: [5] }));
    expect(result).toEqual({ matched: [], priceOnRequest: [] });
  });

  it('BHK filter is ignored on plot categories (no residential filtering noise)', () => {
    const props = [
      p({ id: 'pd1', category: 'plotted-development', kind: 'plot', bhk: undefined, plotSubtype: 'standalone' }),
    ];
    const result = applyFilters(
      props,
      state({ category: 'plotted-development', bhk: [2, 3] }),
    );
    expect(result.matched.map((x) => x.id)).toEqual(['pd1']);
  });
});
