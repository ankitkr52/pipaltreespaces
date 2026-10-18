# Pipaltreespaces

A lead-generation site for a land & property advisor in Patna, Pune, and Gaya. Buyers browse → contact over WhatsApp/call/callback form. No bookings, no accounts, no backend.

## Language

### Core domain

**Advisor**:
The single human business running Pipaltreespaces; receives every lead directly over WhatsApp, call, or form.
_Avoid_: broker, agent, realtor, dealer.

**Buyer**:
The site visitor evaluating a property. May be local to the city or an outstation investor.
_Avoid_: user, customer, client, lead (a lead is the *event*, not the person).

**Lead**:
A single contact event — one WhatsApp message, one call, or one callback form submission — attributed to a property and city when possible. The site's success metric.
_Avoid_: inquiry, submission, enquiry.

**Property**:
One listing: a flat, a home, a plot, a villa, or a penthouse. Lives as a row in `properties.json`.
_Avoid_: listing, project, unit, item, product.

### Taxonomy

**City**:
One of the three markets the advisor operates in. Slug ∈ `{patna, pune, gaya}`. A property belongs to exactly one city.
_Avoid_: location (reserved for the within-property address block), region.

**Category**:
A city-scoped grouping of properties with a shared buying decision. A category only exists in a city if that city's `CityConfig.categories` includes it.
_Avoid_: type, section.

**Kind**:
Discriminator on `Property.kind`: `residential` or `plot`. Drives which fields render and which filters appear (BHK is residential-only).
_Avoid_: type (overloaded), class.

**Plotted Development**:
A `plotSubtype`: a layout project where many plots are sold as part of one approved development.
_Avoid_: layout plot, project plot (use `plotSubtype: 'plotted-development'`).

**Standalone Plot**:
A `plotSubtype`: a single parcel of land sold on its own, independent of any layout project.
_Avoid_: individual plot, independent plot (use `plotSubtype: 'standalone'`).

**Price on Request** (PoR):
A property with `priceType: 'on-request'` — exposed to buyers but never priced in the listing. Shown in a separate group below filtered results; respects BHK/possession filters but bypasses price-range filtering.
_Avoid_: POA, call-for-price, hidden-price.

**Possession Status**:
One of `ready`, `under-construction`, `upcoming`. Filterable (multi-select).
_Avoid_: availability, status (overloaded).

**Featured**:
A boolean flag on a property that promotes it in the Home page's featured block and in ordering within PoR / similar-properties groups.
_Avoid_: highlighted, pinned, promoted.

### Contact surfaces

**WhatsApp CTA**:
A `wa.me` link with a pre-filled message naming the property/city. The primary contact path.
_Avoid_: WhatsApp button (describes the pixel, not the surface).

**Request Callback**:
The Web3Forms-backed form used as the desktop/non-WhatsApp fallback — fields: name, phone, email, city, message. Submissions email the advisor.
_Avoid_: contact form, enquiry form.

### Pages

**City Page**:
`/[city]` — hero + the categories available in that city only.

**Category Listing**:
`/[city]/[category]` — the SEO landing page: filters + property grid + category switcher + PoR group.

**Property Detail**:
`/[city]/[category]/[slug]` — gallery + specs + "Why buy" + sticky WhatsApp/Call + Similar Properties.

**Similar Properties**:
Up to 3 cards on a Property Detail page, matched by same `city` + same `category` (never cross-city), excluding the current property, sorted `featured desc, createdAt desc`. Block hidden if zero matches.
_Avoid_: related, you-may-like, recommendations.

### Design & build

**Dark Luxury**:
The brand's one and only visual mode — near-black backgrounds, warm off-white type, gold/bronze accent, serif display + sans body. Not a dark *theme*: there is no light counterpart and no OS/user toggle.
_Avoid_: dark mode, dark theme.

**Gold Accent**:
Primary brand gold (`#C9A260`), used only on CTAs, logo, active-state, and brand hairlines. Capped at ~10% of any screen.
_Avoid_: gold color, gold branding (not a theme — an accent).

**Programmatic Page**:
A page generated at build time from config/data with its own unique SEO intro — every `/[city]/[category]` and Property Detail URL.
_Avoid_: dynamic page (misleading — it's static).

**Static Export**:
The Next.js build output under `output: 'export'`: a pre-rendered `out/` directory with no server runtime. All content lives in `/data/*` + `/data/blog/*.mdx` and ships via redeploy.
_Avoid_: SSG (ambiguous with ISR), prerender.
