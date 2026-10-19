import type { Testimonial } from '@/lib/types';

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Riya S.',
    locality: 'Boring Road, Patna',
    cityOfInterest: 'patna',
    quoteTitle: 'Honest advice',
    quoteBody: 'Walked me through RERA papers. Zero pressure.',
    avatarType: 'initials',
    featured: true,
    createdAt: '2026-03-15',
  },
  {
    id: 't2',
    name: 'Anil K.',
    locality: 'Hinjewadi, Pune',
    cityOfInterest: 'pune',
    quoteTitle: 'Quick turnaround',
    quoteBody: 'Shortlist in two days. Site visits by the weekend.',
    avatarType: 'initials',
    featured: false,
    createdAt: '2026-04-02',
  },
];
