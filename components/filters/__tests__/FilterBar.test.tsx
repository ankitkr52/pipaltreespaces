import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { p } from '@/lib/__tests__/fixtures/properties';
import type { CategoryConfig } from '@/lib/types';

// useFilterUrl reads/writes the URL via next/navigation. Mock the three hooks it
// touches so FilterBar mounts without a Next router.
const replace = vi.fn();
const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push }),
  usePathname: () => '/patna/flats-homes',
  useSearchParams: () => ({ toString: () => '' }),
}));

import { FilterBar } from '@/components/filters/FilterBar';

const flatsHomes: CategoryConfig = { slug: 'flats-homes', label: 'Flats & Homes', kind: 'residential' };
const plotted: CategoryConfig = {
  slug: 'plotted-development',
  label: 'Plotted Development & Standalone Plots',
  kind: 'plot',
};
const siblings = [flatsHomes, plotted];

const readyFlat = p({
  id: 'ready',
  slug: 'ready',
  title: 'Ready Flat',
  possession: 'ready',
  priceMin: 6_000_000,
  priceMax: 8_000_000, // 50L-1Cr, clear of the 20-50L band ceiling (50L)
});
const ucFlat = p({
  id: 'uc',
  slug: 'uc',
  title: 'UC Flat',
  possession: 'under-construction',
  priceMin: 3_000_000,
  priceMax: 4_000_000, // 20-50L
});
const porFlat = p({
  id: 'por',
  slug: 'por',
  title: 'PoR Flat',
  possession: 'ready',
  priceType: 'on-request',
  priceMin: undefined,
  priceMax: undefined,
});

const pdPlot = p({
  id: 'pd',
  slug: 'pd',
  title: 'PD Plot',
  category: 'plotted-development',
  kind: 'plot',
  bhk: undefined,
  plotSubtype: 'plotted-development',
});
const saPlot = p({
  id: 'sa',
  slug: 'sa',
  title: 'SA Plot',
  category: 'plotted-development',
  kind: 'plot',
  bhk: undefined,
  plotSubtype: 'standalone',
});

beforeEach(() => {
  replace.mockClear();
  push.mockClear();
});

describe('FilterBar + PropertyGrid', () => {
  it('toggling possession narrows the matched grid', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar city="patna" category={flatsHomes} categories={siblings} properties={[readyFlat, ucFlat]} />,
    );
    expect(screen.getByText('Ready Flat')).toBeInTheDocument();
    expect(screen.getByText('UC Flat')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Under construction' }));

    expect(screen.queryByText('Ready Flat')).not.toBeInTheDocument();
    expect(screen.getByText('UC Flat')).toBeInTheDocument();
  });

  it('does not render the BHK filter on a plot category', () => {
    render(
      <FilterBar city="patna" category={plotted} categories={siblings} properties={[pdPlot, saPlot]} />,
    );
    expect(screen.queryByRole('tab', { name: '3 BHK' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: '1 BHK' })).not.toBeInTheDocument();
  });

  it('plotSubtype=standalone narrows the grid', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar city="patna" category={plotted} categories={siblings} properties={[pdPlot, saPlot]} />,
    );
    expect(screen.getByText('PD Plot')).toBeInTheDocument();
    expect(screen.getByText('SA Plot')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Standalone' }));

    expect(screen.queryByText('PD Plot')).not.toBeInTheDocument();
    expect(screen.getByText('SA Plot')).toBeInTheDocument();
  });

  it('renders the EmptyState for a zero-match combination', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar city="patna" category={flatsHomes} categories={siblings} properties={[readyFlat, ucFlat]} />,
    );
    // No property has "upcoming" possession and there is no PoR property.
    await user.click(screen.getByRole('tab', { name: 'Upcoming' }));

    expect(screen.queryByText('Ready Flat')).not.toBeInTheDocument();
    expect(screen.queryByText('UC Flat')).not.toBeInTheDocument();
    expect(screen.getByText(/no properties match/i)).toBeInTheDocument();
  });

  it('keeps Price-on-Request properties below the matched group regardless of price band', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        city="patna"
        category={flatsHomes}
        categories={siblings}
        properties={[readyFlat, ucFlat, porFlat]}
      />,
    );
    // Narrow to the 20-50L band — only UC Flat matches on price.
    await user.click(screen.getByRole('tab', { name: /20.*50L/ }));

    expect(screen.getByText('UC Flat')).toBeInTheDocument();
    expect(screen.queryByText('Ready Flat')).not.toBeInTheDocument();
    // PoR survives the band filter, under its own heading.
    const porHeading = screen.getByRole('heading', { name: /price on request/i });
    expect(porHeading).toBeInTheDocument();
    expect(screen.getByText('PoR Flat')).toBeInTheDocument();
  });
});
