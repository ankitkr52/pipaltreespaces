import { z } from 'zod';

export const CitySlugEnum = z.enum(['patna', 'pune', 'gaya']);
export const CategorySlugEnum = z.enum([
  'flats-homes',
  'plotted-development',
  'upcoming',
  'flats',
  'homes-duplex',
  'villa',
  'penthouse',
]);
export const PossessionEnum = z.enum(['ready', 'under-construction', 'upcoming']);
export const KindEnum = z.enum(['residential', 'plot']);
export const PlotSubtypeEnum = z.enum(['plotted-development', 'standalone']);

export const CategoryConfigSchema = z.object({
  slug: CategorySlugEnum,
  label: z.string().min(1),
  kind: KindEnum,
});

export const CityConfigSchema = z.object({
  slug: CitySlugEnum,
  label: z.string().min(1),
  categories: z.array(CategoryConfigSchema).min(1),
  seoIntro: z.record(CategorySlugEnum, z.string().min(10)).optional(),
});

const BasePropertySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  city: CitySlugEnum,
  category: CategorySlugEnum,
  kind: KindEnum,
  plotSubtype: PlotSubtypeEnum.optional(),
  location: z.object({
    locality: z.string().min(1),
    address: z.string().min(1),
    landmarks: z.array(z.string()),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  priceType: z.enum(['range', 'on-request']),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  area: z.object({ value: z.number().positive(), unit: z.enum(['sqft', 'sqyd']) }),
  bhk: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  floor: z.string().optional(),
  dimensions: z.string().optional(),
  approvalType: z.string().optional(),
  possession: PossessionEnum,
  possessionDate: z.string().optional(),
  rera: z.string().min(1, 'rera must be non-empty'),
  builder: z.object({ name: z.string().min(1), about: z.string().optional() }),
  amenities: z.array(z.string()),
  images: z
    .array(z.string().url())
    .min(6, 'images must have at least 6 entries')
    .max(10, 'images must have at most 10 entries'),
  description: z.string().min(1),
  highlights: z.array(z.string()),
  disclaimer: z.string().optional(),
  ogImage: z.string().optional(),
  featured: z.boolean().optional(),
  createdAt: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export const PropertySchema = BasePropertySchema.superRefine((v, ctx) => {
  // plotSubtype gate
  if (v.category === 'plotted-development' && !v.plotSubtype) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['plotSubtype'],
      message: 'plotSubtype required when category is plotted-development',
    });
  }
  if (v.category !== 'plotted-development' && v.plotSubtype) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['plotSubtype'],
      message: 'plotSubtype only allowed when category is plotted-development',
    });
  }

  // kind-field separation
  if (v.kind === 'plot') {
    if (v.bhk !== undefined)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['bhk'], message: 'bhk forbidden on plot kind' });
    if (v.floor !== undefined)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['floor'], message: 'floor forbidden on plot kind' });
  }
  if (v.kind === 'residential') {
    if (v.dimensions !== undefined)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dimensions'],
        message: 'dimensions forbidden on residential kind',
      });
    if (v.approvalType !== undefined)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['approvalType'],
        message: 'approvalType forbidden on residential kind',
      });
  }

  // price coherence
  if (v.priceType === 'range') {
    if (v.priceMin === undefined || v.priceMax === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceMin'],
        message: 'priceMin and priceMax required when priceType is range',
      });
    } else if (v.priceMin > v.priceMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceMin'],
        message: 'priceMin must be <= priceMax',
      });
    }
  } else {
    if (v.priceMin !== undefined || v.priceMax !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceMin'],
        message: 'priceMin/priceMax forbidden when priceType is on-request',
      });
    }
  }
});

const BaseTestimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  locality: z.string().min(1),
  cityOfInterest: CitySlugEnum,
  quoteTitle: z.string().min(1).max(60),
  quoteBody: z.string().min(1),
  avatarType: z.enum(['initials', 'photo']),
  avatarUrl: z.string().url().optional(),
  consentOnFile: z.boolean().optional(),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  featured: z.boolean().optional(),
  createdAt: z.string().min(1),
});

// Phase-1 guard: photo testimonials rejected at parse time.
// ponytail: flip to the shape-based rule when Phase 2 begins.
export const TestimonialSchema = BaseTestimonialSchema.superRefine((v, ctx) => {
  if (v.avatarType !== 'initials') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['avatarType'],
      message: "Phase-1: avatarType must be 'initials' (photo gated to Phase 2)",
    });
  }
});

export const CallbackPayloadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\+?\d{10,15}$/, 'phone must be 10-15 digits, optional leading +'),
  email: z.string().email(),
  city: CitySlugEnum,
  message: z.string().min(10).max(1000),
  honeypot: z.string(),
});

export const BlogFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  coverImage: z.string().url(),
  publishedAt: z.string().min(1),
  updatedAt: z.string().min(1),
  author: z.string().min(1),
  tags: z.array(z.string()),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    keywords: z.array(z.string()),
  }),
});

export type ValidatedProperty = z.infer<typeof PropertySchema>;
export type ValidatedTestimonial = z.infer<typeof TestimonialSchema>;
