import { describe, it, expect } from 'vitest';
import {
  PropertySchema,
  TestimonialSchema,
  CallbackPayloadSchema,
} from '@/lib/validators';
import { p } from './fixtures/properties';
import { testimonials } from './fixtures/testimonials';

describe('PropertySchema', () => {
  it('accepts a well-formed residential property', () => {
    expect(() => PropertySchema.parse(p({}))).not.toThrow();
  });

  it('accepts a well-formed plotted-development property', () => {
    expect(() =>
      PropertySchema.parse(
        p({
          category: 'plotted-development',
          kind: 'plot',
          bhk: undefined,
          plotSubtype: 'standalone',
          dimensions: '30x40',
        }),
      ),
    ).not.toThrow();
  });

  it('rejects plotted-development without plotSubtype', () => {
    expect(() =>
      PropertySchema.parse(
        p({ category: 'plotted-development', kind: 'plot', bhk: undefined, dimensions: '30x40' }),
      ),
    ).toThrow(/plotSubtype/i);
  });

  it('rejects plotSubtype on a non-plotted category', () => {
    expect(() =>
      PropertySchema.parse(p({ category: 'flats-homes', plotSubtype: 'standalone' })),
    ).toThrow(/plotSubtype/i);
  });

  it('rejects residential bhk on a plot kind', () => {
    expect(() =>
      PropertySchema.parse(
        p({
          category: 'plotted-development',
          kind: 'plot',
          plotSubtype: 'standalone',
          dimensions: '30x40',
          bhk: 3,
        }),
      ),
    ).toThrow(/bhk/i);
  });

  it('rejects plot dimensions on a residential kind', () => {
    expect(() => PropertySchema.parse(p({ dimensions: '30x40' }))).toThrow(/dimensions/i);
  });

  it('rejects priceType=range without priceMin/priceMax', () => {
    expect(() =>
      PropertySchema.parse(p({ priceType: 'range', priceMin: undefined, priceMax: undefined })),
    ).toThrow(/price/i);
  });

  it('rejects priceMin > priceMax', () => {
    expect(() =>
      PropertySchema.parse(p({ priceMin: 9000000, priceMax: 5000000 })),
    ).toThrow(/price/i);
  });

  it('rejects on-request with priceMin set', () => {
    expect(() =>
      PropertySchema.parse(
        p({ priceType: 'on-request', priceMin: 500, priceMax: undefined }),
      ),
    ).toThrow(/price/i);
  });

  it('rejects images.length < 6', () => {
    expect(() =>
      PropertySchema.parse(p({ images: ['https://a/1.jpg', 'https://a/2.jpg'] })),
    ).toThrow(/images/i);
  });

  it('rejects images.length > 10', () => {
    expect(() =>
      PropertySchema.parse(
        p({ images: Array.from({ length: 11 }, (_, i) => `https://a/${i}.jpg`) }),
      ),
    ).toThrow(/images/i);
  });

  it('rejects empty rera', () => {
    expect(() => PropertySchema.parse(p({ rera: '' }))).toThrow(/rera/i);
  });
});

describe('TestimonialSchema', () => {
  it('accepts initials testimonial', () => {
    expect(() => TestimonialSchema.parse(testimonials[0])).not.toThrow();
  });

  it('rejects photo testimonial in Phase 1', () => {
    expect(() =>
      TestimonialSchema.parse({
        ...testimonials[0],
        avatarType: 'photo',
        avatarUrl: 'https://a/b.jpg',
        consentOnFile: true,
      }),
    ).toThrow(/photo|phase/i);
  });
});

describe('CallbackPayloadSchema', () => {
  const good = {
    name: 'Rohan K',
    phone: '+919876543210',
    email: 'r@example.com',
    city: 'patna' as const,
    message: 'Please call me about Boring Road plots.',
    honeypot: '',
  };

  it('accepts a valid payload', () => {
    expect(() => CallbackPayloadSchema.parse(good)).not.toThrow();
  });

  it('rejects short name', () => {
    expect(() => CallbackPayloadSchema.parse({ ...good, name: 'R' })).toThrow();
  });

  it('rejects short phone', () => {
    expect(() => CallbackPayloadSchema.parse({ ...good, phone: '12345' })).toThrow();
  });

  it('rejects short message', () => {
    expect(() => CallbackPayloadSchema.parse({ ...good, message: 'hi' })).toThrow();
  });

  it('rejects long message', () => {
    expect(() => CallbackPayloadSchema.parse({ ...good, message: 'a'.repeat(1001) })).toThrow();
  });

  it('accepts non-empty honeypot (silent-drop happens at handler layer)', () => {
    expect(() => CallbackPayloadSchema.parse({ ...good, honeypot: 'bot' })).not.toThrow();
  });
});
