# Product Requirements Document — Pipaltreespaces (FINAL)

**Project:** Pipaltreespaces — Land & Property Advisor Website
**Domain:** pipaltreespaces.com
**Document owner:** Rohan (Frontend Engineer)
**Version:** 2.1 (FINAL)
**Last updated:** 19 Oct 2026
**Status:** Approved for build
**Supersedes:** PRD v2.0

**Changes from v2.0:**
- **Hosting stays Cloudflare Pages** (not Vercel), but static export is dropped — app now runs as **native Next.js on Cloudflare via `@cloudflare/next-on-pages`**. Enables route handlers, dynamic OG, next.config redirects, and (later) ISR, with no Pro-tier cost. §9.1, §10, §13 reconciled.
- **UI direction tightened** against the Dribbble "Realty" reference: structure, section rhythm, card density, hero style, about-split on home, dark CTA band, chip pattern — all adopted. Dark-luxury palette (§11.2) unchanged.
- **Home section order updated** (§7) to include About split and a formal Dark CTA band before footer.
- **Property schema** gains optional `tags: string[]`. **Testimonials schema** formally specified (§8.4) with Phase-1 "no real photos" enforced in validation.
- **Forms:** Web3Forms replaced by a **Cloudflare Pages Function** (`/app/api/callback/route.ts`, `runtime = 'edge'`) + **Resend** email.
- **Analytics (basic):** **Cloudflare Web Analytics** enabled day one (free, cookieless, first-party). GA4/Pixel/Clarity stay deferred.
- **Hero image minimum spec** pinned (§11.5). Mobile grid column count carries a "TBD after 5-user mobile UX test" note (§7).

**Changes from v1.1 (still carried):**
- **Category rename (all cities):** `Plots & Standalone Plots` → **`Plotted Development & Standalone Plots`**. Patna's previously separate `Plotted Development` category is **merged into** this single combined category.
- **URL slug:** `/[city]/plots` is retired; the merged category now lives at `/[city]/plotted-development`.
- **Design direction (§11) tightened** into concrete tokens (palette, type scale, spacing, motion rules).

---

## 1. Executive Summary

Pipaltreespaces is a **lead-generation real-estate website** for a land & property advisor operating in **Patna, Pune, and Gaya**. The site lets a buyer pick a city, browse the property categories available in that city, filter by price/BHK/possession, and read a persuasive detail page for each property. Every path ends in a single action: **contact the advisor over WhatsApp or phone**, with an **email/callback form** fallback for desktop or non-WhatsApp users.

There is **no online booking, no payment, no user login, and no backend/CMS**. Property data lives in a version-controlled JSON file and is updated manually by the developer via redeploy. The site is a **statically exported Next.js app hosted on Cloudflare Pages** — optimized for fast mobile load and SEO.

**Primary objectives:**
1. Generate qualified leads (WhatsApp + call + form) from an 80% mobile audience.
2. Build brand presence and credibility for a new advisor with no existing web presence.
3. Rank organically for city + category + locality keywords over the long term.

---

## 2. Goals & Success Metrics

### 2.1 Business goals
- **Lead collection** — buyers contact the advisor directly via WhatsApp/call/form after browsing.
- **Brand presence & credibility** — a professional, trustworthy first impression for a brand-new business.

### 2.2 Client-stated targets
| Metric | Client target | Measurement note |
|---|---|---|
| Leads / month | 200 | Tracked manually by the advisor from WhatsApp/call/form logs until analytics is enabled. |
| Organic traffic / month | 10,00,000 | **Long-horizon target, not a 3-month target.** |
| Site visits booked / month | 40 | Tracked manually by the advisor from WhatsApp conversations. |

> **Basic analytics enabled day one:** **Cloudflare Web Analytics** (page views + Core Web Vitals, free, cookieless, first-party). **Marketing analytics deferred:** GA4 + Search Console + Meta Pixel + MS Clarity activate once traffic ramps (approx. month 3-4 post-launch). Until then, lead counting is manual.

### 2.3 Realistic traffic expectation (set with client)
A brand-new domain carries no search authority. Traffic ramps gradually:
- **Month 1-3:** ~2,000-5,000 / month
- **Month 4-6:** ~15,000-40,000 / month
- **Month 7-12:** ~1,00,000-2,00,000 / month
- **10 lakh / month:** realistically a **12-24 month** outcome, dependent on consistent blog/SEO effort.

> This expectation is documented so success is measured against a realistic curve, not against an unachievable 3-month number.

---

## 3. Target Audience & Personas

- **Primary device split:** 80% mobile, 15% desktop, 5% tablet → **mobile-first, non-negotiable.**
- **Age:** 25+
- **Income:** full spectrum — budget homes, premium, and luxury buyers.
- **Geography:** buyers interested in Patna, Pune, and Gaya properties (local + outstation investors).
- **Acquisition channels:** Google Search, Instagram Ads, Facebook Ads.

**Persona (assumption — validate after first ~10 real leads):**
> *Rahul, 30, salaried/self-employed, searching on mobile for a flat or plot within a defined budget in a specific city. Compares a few options, wants quick price/location clarity, then messages the advisor on WhatsApp.*

Because the buyer persona is still an assumption, feature priority favors **speed, clarity, and a frictionless contact path** over advanced discovery features.

---

## 4. Information Architecture

### 4.1 Core navigation model — **city-first**

```
HOME
  └─ Choose City  →  Patna · Pune · Gaya
        └─ CITY PAGE  (shows ONLY that city's categories)
              └─ CATEGORY LISTING  (filters + property grid + category switcher)
                    └─ PROPERTY DETAIL  (gallery, specs, "why buy", WhatsApp/Call CTA, form fallback)
```

### 4.2 Inventory map (city → available categories)

| City | Available categories |
|---|---|
| **Patna** | Flats & Homes · **Plotted Development & Standalone Plots** · Upcoming Projects |
| **Pune** | **Plotted Development & Standalone Plots** · Flats · Homes & Duplex · Villas · Penthouses |
| **Gaya** | **Plotted Development & Standalone Plots** · Flats · Homes & Duplex |

> **Category rename note:** "Plotted Development & Standalone Plots" is a single category covering both layout-plot projects (plotted development) and standalone land parcels. Patna's former separate "Plotted Development" category is folded into this one.

Categories are **config-driven per city** (see §8). A category only renders for a city if it exists in that city's config.

### 4.3 URL structure (SEO-first, programmatic)

| Page | URL pattern | Example |
|---|---|---|
| Home | `/` | `/` |
| City | `/[city]` | `/patna` |
| Category listing | `/[city]/[category]` | `/patna/plotted-development` |
| Property detail | `/[city]/[category]/[slug]` | `/patna/plotted-development/boring-road-rera-layout` |
| About | `/about` | `/about` |
| Contact | `/contact` | `/contact` |
| Blog index | `/blog` | `/blog` |
| Blog post | `/blog/[slug]` | `/blog/how-to-buy-plot-in-gaya` |
| Privacy | `/privacy-policy` | |
| Terms | `/terms` | |
| 404 | `/not-found` | branded error page |

Every `/[city]/[category]` URL is a dedicated SEO landing page (e.g. "flats in Patna", "plotted development & plots in Pune").

---

## 5. User Journey

1. **Land on Home** → hero + "Choose your city" (3 city cards) + featured properties + trust signals.
2. **Select city** → city page shows only that city's category tiles.
3. **Select category** → listing page: property grid for that city+category.
4. **Filter** → price range, BHK (residential only), possession status. Results update live.
5. **Switch category without going back** → a **category switcher** (chip/tab bar) shows all of that city's categories; one click moves to another category in the same city.
6. **Open a property** → detail page: image gallery (6-10), price/size/location, amenities, RERA, builder, possession, and a persuasive **"Why buy this property"** section.
7. **Contact** → prominent **WhatsApp** (pre-filled message) and **Call** buttons; **"Request callback"** form for desktop/non-WhatsApp users. Journey ends here.

---

## 6. Features

### 6.1 MVP (build now)

**Filters (on category listing pages):**
- City (implicit via route) — mandatory
- Category switcher (chips) — all categories of current city
- **Price range** (slider / preset bands: ₹20L-50L, ₹50L-1Cr, ₹1Cr+)
- **BHK** (1 / 2 / 3 / 4 / 5) — shown **only** for residential categories (Flats, Homes, Duplex, Villa, Penthouse)
- **Possession status** (Ready to move / Under construction / Upcoming)
- **Plot sub-type toggle** (within `plotted-development` category only): `All · Plotted Development · Standalone Plot` — lets a buyer narrow the merged category back down without us needing two URLs. Backed by the `plotSubtype` field on the property (§8.2).

**Price-on-Request handling:**
- Properties with a price range respond to the price filter normally.
- Properties marked **"Price on Request"** are collected into a **separate group shown below the filtered results** — never hidden, never lost, but kept out of range-based filtering.
- **Order within the Price-on-Request group:** `featured desc`, then `createdAt desc`.

**Property detail page includes:**
- Title / project name
- Location: locality, address, nearby landmarks (text only — **no map embed**)
- Price (range) or "Price on Request"
- Size (sq ft; sq yd for plots)
- **6-10 image gallery** (Cloudinary-optimized)
- Amenities list
- RERA number *(mandatory legal display)*
- Builder / developer info
- Possession date / construction status
- **"Why buy this property"** — persuasive benefits content
- **WhatsApp CTA** (pre-filled) + **Call CTA** (sticky on mobile) + **Request Callback** button (opens form modal, desktop-primary)
- **Rate disclaimer** (small print): "Prices are indicative and subject to change. Please contact the advisor for current rates."
- **Similar properties** block — rule: same `city` + same `category`, excluding current property, sorted by `featured desc` then `createdAt desc`, max 3 items. If fewer than 3 exist, show whatever is available; hide block if zero.

**EMI Calculator** — standalone component/section (principal, interest rate, tenure → monthly EMI). Doubles as an SEO asset.

**Blog** — mix of:
- (a) SEO buying-guide & locality articles (traffic engine) — e.g. "Plot vs Flat in Patna: which is a better investment", "Property price trends in Gaya 2026"
- (b) Company/project update posts (brand)
- Content authored via Claude Code; min. ~2 articles/month.
- Pipeline: **`@next/mdx` + `gray-matter`** — static, zero-runtime, works with static export.

**Testimonials** — section on home + optional dedicated block, for credibility.
- **Phase 1 (now):** realistic dummy testimonials. Fictional names, locality tags matching real neighbourhoods, **`avatarType: 'initials'` only** — rendered as a gold-ringed circle with a Fraunces initial on `bg/raised`. **No AI faces, no stock photos, no illustrations.** Schema in §8.4 enforces this via Zod.
- **Phase 2 (on content delivery):** swap with real client-approved testimonials (requires `avatarUrl` + `consentOnFile: true` on each record).
- **Dummy content must use clearly fictional names and avoid any likeness of real individuals** (small legal hygiene point to limit misrepresentation risk).

**Contact flow (global):**
- **Single WhatsApp number** for all 3 cities.
- **Single phone number** for all 3 cities (same as WhatsApp).
- **"Request Callback" form** via a **Cloudflare Pages Function** (`/app/api/callback/route.ts` with `export const runtime = 'edge'`) + **Resend** for email delivery — fields: name, phone, email, city of interest, message. Honeypot + Zod validation + per-IP rate limit (5/hour via KV or a cheap in-memory token bucket at the edge). Form submissions email the advisor via the `CONTACT_EMAIL` env var.
- WhatsApp pre-filled message (professional):
  > `Hello, I'm interested in [Property Name] ([Category]) in [City]. Price: [Price Range]. Please share more details and site-visit availability. Thank you.`
  > *(When opened from a non-property page, falls back to a generic message without property placeholders.)*
- All contact CTAs also expose a `mailto:` with pre-filled subject as a last-resort fallback.

### 6.2 Explicitly excluded (out of scope)
- ❌ Map view per property
- ❌ Keyword search bar
- ❌ Compare properties side-by-side
- ❌ Shortlist / favorites / wishlist
- ❌ User login / signup
- ❌ Online booking or payment
- ❌ CMS / admin dashboard
- ❌ Analytics (GA4/Pixel/Clarity) — **deferred to post-launch**, enabled when traffic ramps

### 6.3 Phased rollout

> No hard deadline — quality over speed. Phases exist for sequencing, not time pressure.

**Phase 1 (MVP):** Home · City pages · Category listings · Property detail · Filters · WhatsApp/Call/Form · About · Contact · Privacy · Terms · 404/loading/error states · **Patna live first**, with dummy data for all cities.
**Phase 2:** Full Pune + Gaya inventory · Blog build-out · EMI calculator polish · additional SEO landing content · real testimonials swap-in.
**Phase 3 (post-launch, on client request):** Analytics stack (GA4 + click events + Search Console + Meta Pixel + MS Clarity) · Google Business Profile · real content/images swap-in.

---

## 7. Pages Specification

| Page | Key sections |
|---|---|
| **Home** | Hero (full-bleed desktop, text-first stacked mobile, single gold pill CTA) · Choose-city (3 cards) · Featured properties *(1-col mobile — TBD after 5-user mobile UX test; 2-col tablet; 3-col desktop)* · **About split** (image-left / text-right, link to `/about`) · Why Pipaltreespaces (USPs) · Testimonials (initials avatars) · Blog teaser (1-col mobile · 2-col tablet · 3-col desktop) · **Dark CTA band** ("Looking for the right land, not just another listing?" + WhatsApp primary + Request-callback secondary) · Footer |
| **City** (`/patna`) | Breadcrumb · City hero · Category tiles (city-specific) · Featured in this city · WhatsApp CTA |
| **Category listing** (`/patna/plotted-development`) | **Breadcrumb (Home › City › Category)** · SEO intro text block · Category switcher chips *(horizontal scroll + right-edge gradient fade on mobile; arrow-key scroll for keyboard)* · Filters (**preset price bands — no slider**, BHK, possession, plot-subtype) · Property grid · "Price on Request" group · **Empty state** ("No properties match these filters right now — [clear filters] or [talk to the advisor]") |
| **Property detail** | **Breadcrumb** · Gallery (6-10) with swipe (mobile) / prev-next arrows + counter `3 / 10` (desktop) · Title/price/size · Specs (BHK or plot dims / possession / area / RERA / builder) · Amenities · "Why buy" · Rate disclaimer · Sticky WhatsApp+Call CTA · Request-Callback button · Similar properties (max 3) |
| **About Us** | Brand story · Mission · Why trust us · Team (optional) |
| **Contact** | WhatsApp + Call + email + office address (dummy until client provides) · Business hours · Web3Forms callback form |
| **Blog index + post** | Article grid · MDX post template with SEO meta, headings, CTA |
| **Privacy Policy / Terms** | Standard legal templates *(mandatory)* |
| **404 / not-found** | Branded dark-luxury page with CTA back to Home + Cities |
| **Loading** | Minimal brand-styled skeleton (per route segment via `loading.tsx`) |
| **Error** | Branded `error.tsx` with retry + Home link |
| **Global nav** | Logo-left · desktop center links (Home · Cities ▾ · About · Blog) · right CTAs (Call outline + **WhatsApp gold pill**). Hamburger `<1024px`. **Sticky bottom CTA bar (WhatsApp + Call) site-wide on mobile**, not property-only. |
| **Global footer** | Dark (`bg/sunken`). 4 cols — Brand (logo + 1-line + ©) · **Main Pages** (Home, Patna, Pune, Gaya, About, Contact) · **Other Pages** (Blog, EMI Calculator, Privacy, Terms) · **Reach us** (WhatsApp, Call, Email, Office, Hours + Instagram/Facebook icons). |

---

## 8. Data Model

No backend. All data in `/data/`:

```
/data
  cities.ts          // city + per-city category config
  properties.json    // all properties (manual update → redeploy)
  testimonials.json
  /blog              // MDX posts with frontmatter (gray-matter)
```

### 8.1 City & category config

```ts
export type CitySlug = 'patna' | 'pune' | 'gaya';

export type CategorySlug =
  | 'flats-homes'          // Patna (combined; split only if ≥20 props)
  | 'plotted-development'  // ALL CITIES — combined "Plotted Development & Standalone Plots"
  | 'upcoming'             // Patna only
  | 'flats'                // Pune, Gaya
  | 'homes-duplex'         // Pune, Gaya
  | 'villa'                // Pune
  | 'penthouse';           // Pune

export interface CategoryConfig {
  slug: CategorySlug;
  label: string;           // e.g. "Plotted Development & Standalone Plots"
  kind: 'residential' | 'plot';
}

export interface CityConfig {
  slug: CitySlug;
  label: string;           // "Patna"
  categories: CategoryConfig[];  // ONLY categories available in this city
}
```

> **Breaking change from v1.1:** the standalone `plots` slug is retired. Any existing property records with `category: 'plots'` must be migrated to `category: 'plotted-development'` and tagged with the appropriate `plotSubtype` (§8.2). ponytail: one-time hand-migration in the JSON file; no runtime shim.

### 8.2 Property schema

```ts
export interface Property {
  id: string;
  slug: string;                 // unique within [city]/[category]
  title: string;
  city: CitySlug;
  category: CategorySlug;
  kind: 'residential' | 'plot'; // drives which fields render

  // NEW in v2.0: distinguishes the two sub-types inside the merged plot category.
  // Required when category === 'plotted-development'; omit otherwise.
  plotSubtype?: 'plotted-development' | 'standalone';

  location: {
    locality: string;           // "Boring Road"
    address: string;
    landmarks: string[];
    lat?: number;               // reserved for future, not rendered now
    lng?: number;
  };

  priceType: 'range' | 'on-request';
  priceMin?: number;            // INR, when priceType = 'range'
  priceMax?: number;

  area: { value: number; unit: 'sqft' | 'sqyd' };

  // residential-only
  bhk?: 1 | 2 | 3 | 4 | 5;
  floor?: string;

  // plot-only
  dimensions?: string;          // "30x40"
  approvalType?: string;        // "RERA-approved layout"

  possession: 'ready' | 'under-construction' | 'upcoming';
  possessionDate?: string;      // "Dec 2026"
  rera: string;                 // mandatory display

  builder: { name: string; about?: string };
  amenities: string[];
  images: string[];             // 6-10 Cloudinary URLs
  description: string;          // "why buy" persuasive copy
  highlights: string[];         // benefit bullets

  disclaimer?: string;          // optional override; else default rate disclaimer
  ogImage?: string;             // pre-rendered Cloudinary OG card URL

  featured?: boolean;
  createdAt: string;            // ISO date

  // NEW in v2.1: loose marketing/lifestyle tags, NOT a filter axis in MVP.
  // Used for blog↔property cross-linking, OG keywords, future lifestyle modules.
  // Lowercase-kebab; max ~5 per property.
  tags?: string[];              // e.g. ['waterfront', 'investor-grade', 'ready-to-move']
}
```

> **Rendering rules:**
> - `kind: 'residential'` → render BHK, floor, carpet area; show BHK filter.
> - `kind: 'plot'` → render plot area, dimensions, approval type; hide BHK filter; show `plotSubtype` as a badge on the card ("Plotted Development" / "Standalone").
> - On `/[city]/plotted-development`, the sub-type toggle (§6.1) filters by `plotSubtype`.

### 8.3 Blog post frontmatter (MDX + gray-matter)

```yaml
---
title: "Plot vs Flat in Patna: Which is a Better Investment?"
slug: "plot-vs-flat-patna-investment"
excerpt: "..."
coverImage: "https://res.cloudinary.com/.../patna-plot-vs-flat.jpg"
publishedAt: "2026-10-20"
updatedAt: "2026-10-20"
author: "Pipaltreespaces Team"
tags: ["patna", "investment", "buying-guide"]
seo:
  title: "..."
  description: "..."
  keywords: ["plot in patna", "flat in patna", "..."]
---
```

All current content (descriptions, "why buy", images, numbers, testimonials) uses **realistic dummy data** until the client supplies real content, which the developer swaps in manually.

### 8.4 Testimonials schema

```ts
export interface Testimonial {
  id: string;
  name: string;                       // fictional in Phase 1
  locality: string;                   // "Boring Road, Patna"
  cityOfInterest: CitySlug;
  quoteTitle: string;                 // bold lead line, ≤60 chars
  quoteBody: string;                  // 2-3 sentences
  avatarType: 'initials' | 'photo';   // 'photo' gated to Phase 2
  avatarUrl?: string;                 // required iff avatarType === 'photo'
  consentOnFile?: boolean;            // required true iff avatarType === 'photo'
  rating?: 1 | 2 | 3 | 4 | 5;
  featured?: boolean;
  createdAt: string;                  // ISO date
}
```

**Zod validation (in `/lib/testimonials.ts`):**
- `avatarType === 'photo'` ⇒ `avatarUrl` present AND `consentOnFile === true`, else build fails.
- **Phase-1 lint:** every entry must be `avatarType: 'initials'`. The guard flips open to allow `'photo'` only when Phase 2 begins.

ponytail: the "no real-person photos" rule from §6.1 lives in the type system, not in a reviewer's head.

---

## 9. SEO Strategy

SEO is central to the traffic goal. Build it in from day one.

### 9.1 Technical SEO
- **Static export** → fully pre-rendered HTML, fast crawl, great Core Web Vitals.
- Unique `<title>` + meta description per page (city, category, property, blog).
- **Open Graph + Twitter cards** for social shares (Instagram/Facebook traffic).
- **OG image strategy:** static OG for home/about/contact; **per-property OG** generated as a Cloudinary template URL (brand background + property title + price text overlay) stored on `property.ogImage` or built from a URL helper at build time.
- **Structured data (JSON-LD):**
  - `RealEstateListing` / `Residence` / `Product` on property pages
  - `BreadcrumbList` on all nested pages
  - `Organization` + `LocalBusiness` on home/contact
  - `Article` on blog posts
  - `FAQPage` where FAQs exist
- Auto-generated `sitemap.xml` + `robots.txt`.
- Semantic HTML, proper heading hierarchy, descriptive alt text on every image.
- Canonical URLs; clean, keyword-rich slugs.
- **Redirect:** old `/[city]/plots` URLs → `/[city]/plotted-development` via **`next.config.ts` `async redirects()` returning 301s** (works through `@cloudflare/next-on-pages`; version-controlled, works in `next dev`, no platform-specific file). ponytail: a 10-line array, not middleware.

### 9.2 Programmatic landing pages
Each `/[city]/[category]` is an SEO landing page with a unique intro paragraph targeting its keyword (e.g. "Flats in Patna", "Plotted Development & Plots in Pune", "Plots in Gaya"). ~8 pages auto-generated from config.

### 9.3 Keyword research (developer to perform)
Client gave no keywords → research required. Starter themes:
- `flats in patna`, `2 bhk in patna`, `property in boring road patna`
- `plotted development patna`, `plots in gaya`, `land for sale in gaya`, `standalone plot in patna`
- `villas in pune`, `penthouse in pune`, `flats in [pune locality]`
- `home loan emi calculator`

Deliverable: a keyword map (page → primary + secondary keywords) finalized before blog writing begins.

### 9.4 Blog strategy
Mix of buying guides / locality insights (traffic) + company posts (brand), authored via Claude Code, targeting the keyword map. Consistency (~2/month minimum) is what compounds into the long-term traffic curve.

### 9.5 Off-site (post-launch, client to action)
- Google Business Profile (biggest local-SEO lever) — set up after launch.
- Local citations/directories.

---

## 10. Technical Architecture

| Layer | Choice |
|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** |
| Rendering | **Native Next.js on Cloudflare Pages via `@cloudflare/next-on-pages`** — App Router SSG via `generateStaticParams`, with edge route handlers available for forms and (future) ISR. **No `output: 'export'`.** |
| Styling | **Tailwind CSS** |
| Components | **shadcn/ui** (base) |
| Animation | **GSAP + ScrollTrigger ONLY** — dynamic-imported for desktop/visible sections; CSS/Tailwind transitions for mobile hover/press |
| Icons | **Lucide React** |
| Images | **Cloudinary** (free tier) as source + per-property OG card template, with `f_auto,q_auto,w_<width>` transforms. `next/image` renders Cloudinary URLs via `remotePatterns`. No `images.unoptimized`. |
| Blog | **`@next/mdx` + `gray-matter`** |
| Forms | **Cloudflare Pages Function** (`/app/api/callback/route.ts`, `runtime = 'edge'`) + **Resend** email + **React Hook Form + Zod** + honeypot + per-IP rate limit |
| Data | `/data/properties.json` + `cities.ts` + `/data/blog/*.mdx` — manual update, redeploy |
| Hosting | **Cloudflare Pages** (unchanged) — now running native Next.js, no static export |
| Domain | **pipaltreespaces.com** |
| Lead channel | `wa.me` + `tel:` + Cloudflare Pages Function + Resend + `mailto:` (single number/email, all cities) |
| Analytics | **Day one:** Cloudflare Web Analytics (free, cookieless). **Deferred:** GA4 + Search Console + Meta Pixel + MS Clarity (post-launch, on traffic ramp) |

### 10.1 Cloudflare Pages (next-on-pages) deployment notes
- `next.config.ts` → **no** `output: 'export'`. Add `images.remotePatterns` for `res.cloudinary.com` so `next/image` can render Cloudinary sources through its optimizer.
- **API routes used sparingly:** `/app/api/callback/route.ts` for the lead form only. `export const runtime = 'edge'` so it runs as a Pages Function on Workers. No session, no DB.
- All dynamic page routes still pre-generated via `generateStaticParams` from the JSON data at build time (fast crawl, cached edge responses).
- **Build command:** `npx @cloudflare/next-on-pages`. **Output directory:** `.vercel/output/static` (the adapter writes here; Cloudflare Pages serves it). **Node:** 20+. **Compat flag:** `nodejs_compat` enabled in `wrangler.toml` / Pages dashboard.
- **Env vars** (Pages dashboard, Production + Preview): `RESEND_API_KEY`, `CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE_NUMBER`, `NEXT_PUBLIC_SITE_URL`. (Removed: `WEB3FORMS_ACCESS_KEY`.)
- **Scale note:** Cloudflare Pages caps a deploy at 20,000 files and 25MB per file; next-on-pages adds a Workers bundle under 1MB compressed for this inventory size. Current inventory (~50 properties) is nowhere near; revisit if the catalog grows to 500+.
- **Tier:** Cloudflare Pages free tier covers production — unlimited sites, 500 builds/month, 20,000 files/deploy. No Pro cost.

### 10.2 Animation budget (GSAP-only)
- GSAP + ScrollTrigger imported via `dynamic(() => import(...), { ssr: false })` and gated by viewport width (desktop/tablet).
- Mobile: CSS transitions + Tailwind `motion-safe:` utilities only — no GSAP scroll timelines on mobile.
- Honor `prefers-reduced-motion` — all non-essential animation disabled.
- Hero animation: CSS-only (fade + subtle scale) to protect LCP.

### 10.3 Suggested folder structure
```
/app
  /(marketing)        about, contact, privacy, terms
  /[city]             city page
  /[city]/[category]  listing page
  /[city]/[category]/[slug]  property detail
  /blog               index + [slug]
  not-found.tsx       branded 404
  loading.tsx         global loader
  error.tsx           global error boundary
/components           ui/, property/, filters/, layout/, sections/, forms/
/data                 cities.ts, properties.json, testimonials.json, /blog
/lib                  seo.ts, emi.ts, whatsapp.ts, filters.ts, cloudinary.ts, og.ts
/public               logo, static assets
```

---

## 11. Design Direction — Dark Luxury (concrete tokens)

Vibe is unchanged from v1.1 (dark, premium, Valora-hotel-inspired). What's new here: concrete, buildable tokens so the dark-luxury intent survives contact with implementation.

### 11.1 Core principles
- **Dark-first, mobile-first.** Design for #0b0b0d at 380px, scale up. Never auto-switch to light based on OS preference — the brand *is* dark.
- **Gold is an accent, not a flood.** Primary gold used only on CTAs, logo, brand hairlines, and the active state of filters/chips. If more than ~10% of a screen is gold, cut it.
- **Photography carries the warmth.** Property hero images are the color — the UI chrome stays near-neutral so photos don't fight the frame.
- **Breath over density.** Generous spacing; a half-full card beats a stuffed one.

### 11.2 Color tokens

| Token | Hex | Use |
|---|---|---|
| `bg/base` | `#0B0B0D` | Page background |
| `bg/raised` | `#141418` | Cards, modal, filter bar |
| `bg/sunken` | `#060607` | Hero overlay, footer |
| `border/subtle` | `#24242A` | Card borders, dividers |
| `border/strong` | `#3A3A42` | Focused inputs, active chip border |
| `text/primary` | `#F2EFE8` | Headings, primary body (warm off-white, not pure white) |
| `text/secondary` | `#A8A49C` | Secondary body, labels |
| `text/muted` | `#6B6862` | Captions, disclaimers, placeholder |
| `brand/gold` | `#C9A260` | Primary CTA, logo accent, active-state |
| `brand/gold-hover` | `#D9B374` | Hover/press on gold |
| `brand/bronze` | `#8A6A3A` | Secondary accent, dividers under gold text |
| `signal/success` | `#6FAE7A` | "Ready to move" pill |
| `signal/warn` | `#D9A14A` | "Under construction" pill |
| `signal/info` | `#7FA2C9` | "Upcoming" pill |
| `focus/ring` | solid `#C9A260` + 2px `#0B0B0D` offset | Keyboard focus ring. **Never alpha-blended** — 60% gold against `bg/raised` fails AA. The dark offset ring gives separation on both `bg/base` and `bg/raised`. |

Expose as Tailwind theme extensions in `tailwind.config.ts`; never hard-code hex in components.

### 11.3 Typography
- **Display / Headings:** `Fraunces` (serif, high-contrast, luxury-leaning) — `600` weight, slight negative tracking (`-0.01em`). Weights loaded: 400, 600.
- **Body / UI:** `Inter` (sans) — `400` body, `500` UI labels, `600` buttons. Weights loaded: 400, 500, 600.
- **Numerals in price/EMI:** tabular (`font-feature-settings: "tnum"`) so prices align in cards.
- **Scale (mobile → desktop):**

| Role | Mobile | Desktop |
|---|---|---|
| H1 (hero) | 36 / 40 | 64 / 72 |
| H2 (section) | 28 / 34 | 44 / 52 |
| H3 (card title) | 20 / 28 | 24 / 32 |
| Body | 16 / 26 | 17 / 28 |
| Small / meta | 13 / 20 | 14 / 22 |
| Button | 15 / 20 | 16 / 22 |

Load fonts via `next/font/google` with `display: 'swap'` and preload only the weights listed.

**Typography rules (contrast + legibility floor):**
- **Fraunces only at ≥20px** (H3+ and gallery captions). Below that, Inter — serif thin strokes dissolve at small sizes on dark.
- **Gold is never body copy.** Permitted uses: CTAs, headlines accent, active chip text, price (tabular numerals). All body paragraphs: `text/primary` or `text/secondary`.
- **`text/muted` is ≥14pt only** (captions, disclaimers, placeholders). Fails AA Normal below that on `bg/base`.

### 11.4 Spacing, radius, elevation
- **Spacing scale:** Tailwind default (4px step). Section vertical padding: `py-16` mobile, `py-28` desktop.
- **Radius:** cards `rounded-2xl` (16px), buttons `rounded-full` (CTAs) or `rounded-lg` (secondary), inputs `rounded-xl`.
- **Elevation on dark:** no drop shadows — use `border/subtle` + a 1px inner highlight (`inset 0 1px 0 rgba(255,255,255,0.04)`) to lift cards. Shadows look muddy on near-black; borders look crisp.

### 11.5 Imagery
- Property photos: 16:9 on cards, 3:2 or 16:9 in gallery. Cloudinary `f_auto,q_auto,c_fill`.
- **Overlay recipe for hero/image-title compositions:** linear gradient `from-black/70 via-black/30 to-transparent`, bottom-aligned text, gold hairline divider between title and meta.
- No stock-photo "diverse business team" — use architecture / interior / landscape only.

**Hero image minimum spec (home + city hero):**
- **Source dimensions:** ≥ 1920×1080 (16:9). 4K-source accepted but not required.
- **Format:** AVIF primary, WebP fallback (Cloudinary `f_auto` handles negotiation).
- **File size budget:** ≤ 250KB at `w_1920,q_auto`; ≤ 90KB at `w_828` (mobile hero).
- **Responsive widths:** `640, 750, 828, 1080, 1200, 1920` via `next/image sizes`.
- **CLS floor:** `aspect-ratio: 16/9` set in CSS; `priority` on the home hero `<Image>` to preload above the fold.
- **LCP target:** home hero image fully painted < 2.0s on 4G mid-tier Android. If image can't meet it, swap to a near-black colour-block hero with Fraunces headline as LCP (text node is instant).
- **Subject safety zone:** keep the key subject out of the centre 20% band — the Dark CTA copy or gradient overlay sits there on compositions where text overlays the image.

### 11.6 Components (shadcn/ui + dark tokens)
- **Primary CTA:** gold fill, dark text (`bg/base`), full-rounded. Hover lifts to `gold-hover` + 1px gold ring.
- **Secondary CTA:** transparent, gold border, gold text. Hover fills gold.
- **Chip (category switcher):** `bg/raised`, `border/subtle`, text `secondary`. Active: `border/strong` + text `gold` + 1px bottom gold underline.
- **Filter pill (status):** colored dot + text; background `bg/raised`.
- **Card:** `bg/raised`, `border/subtle`, 16px radius, image-top, 20px internal padding, price in gold (tabular numerals).
- **Sticky mobile CTA bar:** `bg/sunken` with `backdrop-blur-md`, two buttons (WhatsApp primary gold, Call secondary outline), safe-area inset bottom padding. **Site-wide on mobile**, not property-only.
- **Breadcrumb:** `text/secondary` for ancestors, `text/primary` for current page, `›` separator in `brand/bronze`. Rendered on all `/[city]`, `/[city]/[category]`, `/[city]/[category]/[slug]`, `/blog/[slug]`.
- **Empty state (filter miss):** centered `bg/raised` card: Fraunces one-liner · 2 CTAs (clear filters + talk to advisor).
- **Grid skeleton:** 16:9 image shimmer + two text bars; used by `loading.tsx` and during filter transitions.
- **Chip overflow (mobile):** horizontal scroll · right-edge 32px gradient fade from `bg/base` · arrow-key scrolling for keyboard users.
- **Gallery nav:** mobile swipe + dot indicators; desktop prev/next arrows + counter (`3 / 10`); `Esc` closes lightbox.
- **About split (home):** image-left (16:9) / text-right (Fraunces H2 + 2-paragraph body + "Learn more →" gold link). Stacks mobile with image first, text second.
- **Dark CTA band:** full-bleed `bg/sunken` + 1px `brand/bronze` top divider · centered Fraunces H2 ("Looking for the right land, not just another listing?") · subtitle ("City-local guidance from someone who's walked the plots.") · two CTAs (WhatsApp primary gold + "Request callback" outline).
- **Global nav:** logo-left · desktop center links · right CTAs (Call outline + WhatsApp gold pill). Hamburger `<lg` (1024px).
- **Testimonial card:** gold-ringed initials circle (56px, Fraunces 600 initial) · Fraunces quote-title · Inter quote-body · attribution line (name · locality · city tag).

### 11.7 Motion
- **Desktop (≥1024px):** GSAP ScrollTrigger reveals — 400ms, `power2.out`, 24px y-translation + opacity. One reveal per section, never per card.
- **Mobile:** CSS only — `transition-opacity`, `transition-transform` under `motion-safe:`. No scroll-driven animation.
- **Hover microinteractions:** 150ms. Card hover lifts border to `border/strong` and nudges image `scale-[1.02]`.
- **Reduced motion:** all non-essential motion disabled; CTA focus/hover states still show (color only).
- **Mobile tap feedback:** `active:scale-[0.98]` + 50ms transition on every interactive element. Reduced-motion override: color-only state change (no scale).

### 11.8 Accessibility floor (non-negotiable on dark)
- Minimum body contrast 4.5:1 against `bg/raised`. Gold on dark meets AA for 14pt+.
- Focus ring (§11.2 `focus/ring`) visible on every interactive element — never `outline: none` without a replacement. **Verified:** gold vs `bg/base` ≈ 8.5:1; vs `bg/raised` ≈ 7.5:1 — clears AAA 3:1 state-contrast.
- Icon-only buttons carry `aria-label`.
- CTA target ≥ 44×44px with ≥8px gap between adjacent tap targets.
- **A11y raises from design-system audit (see `docs/design-system.md` for full list):** chips are `<button aria-pressed>` with `+N` disclosure when overflowing; `body` carries `scroll-padding-bottom` matching the sticky mobile CTA bar; property card reserves a 24px status-pill slot (CLS); `next/font` `adjustFontFallback` set for both Fraunces and Inter; modal is focus-trapped with Esc-close; forms carry inline errors (`aria-live="polite"`) + top-of-form summary when >1; toast uses `role="status"`; skip-to-content link is the first focusable element on every page.

### 11.9 Logo & brand marks
- Client-supplied logo (gold peepal tree over a house roof on black). Lockup: logo + wordmark side-by-side on desktop header, logo-only on mobile header.
- Minimum logo size: 32px height. Always on `bg/base` or darker; never on photographic background without a `bg/sunken` scrim behind it.

### 11.10 Process
Rohan supplies UI references (dribbble folder: `/refrence/dribbble/`) to Claude Code and builds using Claude Code skills. A short reference/mood-board approval precedes heavy coding. The light-themed HomeZZ dribbble refs are kept as **layout/structure** inspiration (card density, hero search block, filter bar) — their *color system is deliberately not adopted*; the site remains dark-luxury.

---

## 12. Non-Functional Requirements

- **Performance:** Lighthouse mobile ≥ 90; LCP < 2.5s on 4G; lazy-load images; Cloudinary responsive URLs.
- **Responsive:** mobile / tablet / desktop — mobile is primary.
- **Accessibility:** semantic HTML, alt text, color contrast AA, keyboard-focusable CTAs, visible focus rings on dark theme (see §11.8).
- **Browser support:** latest 2 versions of Chrome, Safari, Firefox; Android Chrome + iOS Safari.
- **Maintainability:** typed data, config-driven cities/categories, reusable components.
- **Legal:** RERA numbers on listings; Privacy Policy + Terms pages present; rate disclaimer on every property; dummy testimonials use clearly fictional names.
- **Resilience:** branded `not-found`, `loading`, `error` states for every segment.

---

## 13. Dependencies & Pending Inputs (from client)

| Item | Status | Handling |
|---|---|---|
| WhatsApp + call number (single) | **Pending** | Placeholder in config; swap manually |
| Office address + email | Pending | Dummy on Contact; swap manually |
| Property descriptions / "why buy" / real images | Pending | Realistic dummy now; swap manually |
| Real testimonials (names + photos + consent) | Pending | Dummy with fictional names now; swap manually |
| Logo file | **Available** | Use in build |
| Target keywords | Not provided | Developer researches |
| Analytics / GBP setup | Deferred | Post-launch on client request |
| **Resend API key** | **Needed** | Developer registers free account; stores `RESEND_API_KEY` + `CONTACT_EMAIL` in Cloudflare Pages env (Production + Preview) |

> Content delay is the #1 risk to any such project; dummy-first build keeps progress unblocked.

---

## 14. Assumptions

1. Buyer persona is assumption-based; validate after ~10 real leads and revisit feature priority.
2. Single WhatsApp/call number serves all cities and all lead volume.
3. 10 lakh/month traffic is a 12-24 month goal, not a launch KPI.
4. Data stays small enough (≈50+ properties) to manage via JSON + redeploy without a CMS.
5. No regulatory/payment handling needed since the site never transacts.
6. Manual lead counting is acceptable to the client until analytics is enabled post-launch.
7. "Plotted Development" and "Standalone Plots" buyers overlap enough that one merged listing + a sub-type toggle serves both better than two separate pages. Revisit if either sub-type crosses ~20 listings in a city and SEO gains from splitting become clear.
8. Testimonials remain Phase-1 fictional with initials avatars until the client supplies real content **and** signed consent (`consentOnFile: true` enforced in Zod — §8.4).
9. **GSAP license:** GSAP 3.13+ (core + ScrollTrigger) is free under GreenSock's standard license post-Webflow acquisition (2024). Premium plugins — SplitText, MorphSVG, ScrollSmoother, Draggable advanced features — remain Business Green and **are not used**. If a future reveal needs SplitText, revisit the budget line.
10. Mobile featured-grid column count defaults to 1-col; **TBD after a 5-user mobile UX test** post-first-build. Reconsider 2-col only if cards read as sparse at thumbscroll pace without cheapening the image presentation.

---

## 15. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Unrealistic traffic expectation | Client dissatisfaction | Realistic curve documented (§2.3); report against it |
| Content delay from client | Stalled launch | Dummy-first build; manual swap-in |
| **Dummy testimonials misread as real** | Minor legal/consumer-trust risk | Use clearly fictional names; swap to real testimonials in Phase 2; no real-person photos |
| **No analytics at launch** | Can't quantify lead attribution early | Manual lead log by advisor; enable GA4 the moment traffic ramps |
| Manual data updates become tedious at scale | Dev time sink | JSON kept clean/typed; migrate to light CMS only if volume grows |
| Image weight hurts mobile speed | SEO + UX loss | Cloudinary `f_auto,q_auto`, lazy-load, 6-10 images cap |
| Thin programmatic pages | SEO penalty | Unique intro copy + real content per city/category page |
| GSAP bundle on mobile | LCP regression | Dynamic import, desktop-only ScrollTrigger, reduced-motion honored |
| **Merged plot category confuses buyers** | Lead drop-off on listing page | Sub-type badge on every card + sub-type toggle filter on listing; copy on the SEO intro paragraph explains the distinction in one line |
| **Old `/plots` URLs lose SEO equity** | Traffic loss on existing links | 301 redirects via `next.config.ts async redirects()` (§9.1) + updated sitemap |
| Real-photo testimonial added without consent | Legal / consumer trust | Zod gate in `/lib/testimonials.ts` — `avatarType: 'photo'` requires `avatarUrl` + `consentOnFile: true`, or build fails |
| Focus ring invisible on `bg/raised` | A11y regression | Solid gold + 2px `bg/base` offset per §11.2 (never alpha-blended) |
| Fraunces serif unreadable at small UI sizes | Perceived quality drop + a11y | §11.3 rule: Fraunces ≥20px only; Inter below |
| `next-on-pages` adapter breaks on a Next.js minor bump | Build fails on upgrade | Pin Next + adapter versions in `package.json`; upgrade pair-wise; test on Pages preview before Production |

---

## 16. Open Questions & Resolved Decisions

**Resolved in v2.0 (FINAL):**
- ~~Should "Plotted Development" and "Plots & Standalone Plots" stay separate (Patna) or combined across cities?~~ → **Combined everywhere** as `plotted-development` category, label "Plotted Development & Standalone Plots", with a `plotSubtype` field + listing-page toggle for buyers who want to narrow.
- ~~Design direction: pivot to light/modern (dribbble style) or keep dark luxury?~~ → **Keep dark luxury.** Dribbble refs retained as structural inspiration only; concrete tokens pinned in §11.

**Resolved in v1.1 (still holds):**
- ~~Analytics at launch?~~ → **Deferred post-launch** (client decision).
- ~~Framer Motion + GSAP?~~ → **GSAP only** (bundle size).
- ~~Blog pipeline?~~ → **`@next/mdx` + `gray-matter`**.
- ~~Images: `next/image` vs Cloudinary?~~ → **Cloudinary primary + `next/image` for layout/lazy**.
- ~~Flats and Homes split for Patna?~~ → **Keep combined** as `flats-homes` for now; split only if inventory in Patna exceeds ~20 properties.

**Resolved in v2.1:**
- ~~Hosting: Cloudflare Pages or Vercel?~~ → **Cloudflare Pages stays**, but running native Next.js via `@cloudflare/next-on-pages` (not static export). Keeps free-tier cost; unlocks route handlers, next.config redirects, dynamic OG.
- ~~Home chip row (Dribbble pattern)?~~ → **No** — categories differ per city; no honest cross-city chip taxonomy exists. Chips stay on listing pages.
- ~~Testimonial avatars?~~ → **Initials in gold-ringed circle** — Phase-1 enforced by schema (§8.4). No AI faces, no stock photos.
- ~~Dark CTA band copy for an advisor (not builder)?~~ → "Looking for the right land, not just another listing?" (§11.6).
- ~~Forms: Web3Forms or route handler?~~ → **Cloudflare Pages Function + Resend** (edge runtime).
- ~~Basic analytics at launch?~~ → **Cloudflare Web Analytics day one** (free, cookieless). Marketing stack still deferred.

**Still open (track, non-blocking):**
1. Competitor reference sites — client to share later.
2. Exact localities per city for future locality filtering.
3. Final font sign-off during design pass (Fraunces + Inter proposed in §11.3; alternatives: Playfair Display / Lora + Inter).
4. Mobile grid column count — 1-col default; revisit after 5-user mobile UX test.

### 16.1 Pre-code checklist (post-PRD-approval)

Execute in order. Do not write component code before step 5 is accepted.

1. Approve PRD v2.1.
2. Scaffold the Next.js 15 app (`pnpm create next-app@latest`, App Router, TS, Tailwind). Install `@cloudflare/next-on-pages`, `shadcn/ui`, `lucide-react`, `gsap`, `@next/mdx`, `gray-matter`, `resend`, `react-hook-form`, `zod`.
3. Write `tailwind.config.ts` extending `theme.colors` with §11.2 tokens, `theme.extend.fontFamily` with Fraunces + Inter, and `fontSize` from §11.3 scale. Add `safelist` for status-pill colour variants.
3.5. **Read both skill docs end-to-end** before invoking — `~/.claude/skills/ui-ux-pro-max/` and `~/.claude/skills/frontend-design/` (or the plugin paths they live at). Skim the README and any references/*.md so the skill output surprises nothing and token overrides can be rejected on sight.
4. Write `docs/design-system.md` quoting §11.2–§11.8 verbatim as the **pinned source of truth** for both skills.
5. Invoke **`ui-ux-pro-max`** with scope: *audit tokens against §11, flag accessibility gaps, propose component inventory*. **Reject any proposed token changes that touch brand colors or type scale;** accept only accessibility raises (contrast, focus, tap size).
6. Invoke **`frontend-design`** per component, in this order, feeding each the `docs/design-system.md` + the §11.6/§7 spec row:
   Nav → Hero → City card → Property card → Chip → Filter bar → Breadcrumb → Testimonial card → About split → Dark CTA band → Blog card → Empty state → Grid skeleton → Footer.
7. Build pages: Home → City → Category listing → Property detail → Blog index/post → About/Contact → Privacy/Terms → not-found/loading/error.
8. Only then run the full Lighthouse + axe pass against §12 and §11.8 floors.

---

*End of PRD v2.1 — FINAL*
