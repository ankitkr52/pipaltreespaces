# Pipaltreespaces Design System — pinned source of truth

**Status:** canonical. Both `ui-ux-pro-max` and `frontend-design` skills must treat this file as read-only input. Any token change must be amended here first and only then propagated to `tailwind.config.ts` and components.

This document mirrors PRD §11.1–§11.9 verbatim. If the PRD and this file drift, the PRD wins — re-sync.

---

## Core principles (PRD §11.1)

- **Dark-first, mobile-first.** Design for #0B0B0D at 380px, scale up. Never auto-switch to light based on OS preference.
- **Gold is an accent, not a flood.** Primary gold used only on CTAs, logo, brand hairlines, and the active state of filters/chips. If more than ~10% of a screen is gold, cut it.
- **Photography carries the warmth.** Property hero images are the color — the UI chrome stays near-neutral.
- **Breath over density.** Generous spacing; a half-full card beats a stuffed one.

---

## Color tokens (PRD §11.2) — PINNED

| Token | Hex | Use |
|---|---|---|
| `bg/base` | `#0B0B0D` | Page background |
| `bg/raised` | `#141418` | Cards, modal, filter bar |
| `bg/sunken` | `#060607` | Hero overlay, footer |
| `border/subtle` | `#24242A` | Card borders, dividers |
| `border/strong` | `#3A3A42` | Focused inputs, active chip border |
| `text/primary` | `#F2EFE8` | Headings, primary body (warm off-white) |
| `text/secondary` | `#A8A49C` | Secondary body, labels |
| `text/muted` | `#6B6862` | Captions, disclaimers, placeholder — **≥14pt only** |
| `brand/gold` | `#C9A260` | Primary CTA, logo accent, active-state. **Never body copy.** |
| `brand/gold-hover` | `#D9B374` | Hover/press on gold |
| `brand/bronze` | `#8A6A3A` | Secondary accent, dividers under gold text |
| `signal/success` | `#6FAE7A` | "Ready to move" pill |
| `signal/warn` | `#D9A14A` | "Under construction" pill |
| `signal/info` | `#7FA2C9` | "Upcoming" pill |
| `focus/ring` | solid `#C9A260` + 2px `#0B0B0D` offset | Keyboard focus. **Never alpha-blended.** |

---

## Typography (PRD §11.3) — PINNED

- **Display / Headings:** `Fraunces` (serif) — 600 weight, `-0.01em` tracking. Weights loaded: 400, 600.
- **Body / UI:** `Inter` (sans) — 400 body, 500 UI labels, 600 buttons. Weights loaded: 400, 500, 600.
- **Numerals in price/EMI:** tabular (`font-feature-settings: "tnum"`).

### Scale (mobile → desktop, px / line-height px)

| Role | Mobile | Desktop |
|---|---|---|
| H1 (hero) | 36 / 40 | 64 / 72 |
| H2 (section) | 28 / 34 | 44 / 52 |
| H3 (card title) | 20 / 28 | 24 / 32 |
| Body | 16 / 26 | 17 / 28 |
| Small / meta | 13 / 20 | 14 / 22 |
| Button | 15 / 20 | 16 / 22 |

### Typography rules (contrast + legibility floor)

- **Fraunces only at ≥20px.** Below that, Inter.
- **Gold is never body copy.** Permitted: CTAs, headlines accent, active chip text, price.
- **`text/muted` only ≥14pt.**

---

## Spacing, radius, elevation (PRD §11.4)

- Spacing: Tailwind default 4px step. Section vertical padding `py-16` mobile, `py-28` desktop.
- Radius: cards `rounded-2xl` (16px); CTA buttons `rounded-full`; secondary buttons `rounded-lg`; inputs `rounded-xl`.
- **No drop shadows on dark.** Lift cards with `border/subtle` + 1px inner highlight `inset 0 1px 0 rgba(255,255,255,0.04)`.

---

## Hero image minimum spec (PRD §11.5)

- Source ≥ 1920×1080 (16:9). AVIF primary, WebP fallback via Cloudinary `f_auto`.
- Budget: ≤250KB at `w_1920,q_auto`; ≤90KB at `w_828`.
- Responsive widths: 640, 750, 828, 1080, 1200, 1920.
- CLS floor: CSS `aspect-ratio: 16/9` + `priority` on home hero `<Image>`.
- LCP target: < 2.0s on 4G mid-tier Android. If image can't meet it, swap to colour-block hero with Fraunces headline as LCP.
- Subject safety zone: keep key subject out of centre 20% band (overlay copy lives there).

---

## Components (PRD §11.6)

Full inventory with per-component specs lives in PRD §11.6. Build order (per §16.1 checklist):

Nav → Hero → City card → Property card → Chip → Filter bar → Breadcrumb → Testimonial card → About split → Dark CTA band → Blog card → Empty state → Grid skeleton → Footer.

---

## Motion (PRD §11.7)

- Desktop (≥1024px): GSAP ScrollTrigger reveals — 400ms `power2.out`, 24px y-translate + opacity. One reveal per section.
- Mobile: CSS only — `transition-opacity`, `transition-transform` under `motion-safe:`. No scroll-driven animation.
- Hover: 150ms. Card hover lifts border to `border/strong`, image `scale-[1.02]`.
- **Mobile tap feedback:** `active:scale-[0.98]` + 50ms. Reduced-motion override: colour-only.
- Reduced motion: all non-essential motion disabled; focus/hover colour states remain.

---

## Accessibility floor (PRD §11.8) — non-negotiable

- Minimum body contrast 4.5:1 against `bg/raised`.
- Focus ring (solid gold + 2px dark offset) on every interactive element.
- Icon-only buttons carry `aria-label`.
- CTA target ≥ 44×44px with ≥8px gap between adjacent targets.
- Chip overflow: arrow-key scrolls focused chip via `scrollIntoView({block:'nearest'})`.

### A11y raises from ui-ux-pro-max audit (locked)

- **A1 — Chip semantics + overflow:** chips are `<button type="button" role="tab" aria-pressed={isActive}>`, not styled divs. Scrollable rail is OK, but add a `+N more` disclosure if total chips exceed visible count; chip rail wraps (does not scroll) when total ≤ 5.
- **A2 — Sticky bar vs focus:** apply `scroll-padding-bottom: calc(var(--sticky-cta-h) + env(safe-area-inset-bottom))` on `body`. Sticky bar is last in tab order, never first.
- **A3 — Card CLS:** reserve a 24px-high status-pill slot on property cards even when no pill is applied.
- **A5 — Font-load CLS:** `next/font/google` `adjustFontFallback: 'Times New Roman'` for Fraunces, `'Arial'` for Inter.
- **A6 — Modal:** focus trap, `Esc` closes, `aria-labelledby` + `aria-describedby`, focus returns to trigger on close, body scroll lock.
- **A7 — Form errors:** inline error below field (`text-signal-warn`, 14px, `aria-live="polite"`), `aria-describedby` wiring; top-of-form error summary when >1 error.
- **A8 — Toast:** `role="status"`, auto-dismiss 5s, dismissible, bottom-centre on mobile (above sticky bar), top-right on desktop.
- **A9 — Skip link:** visually-hidden-until-focused first focusable element: `href="#main"`, Fraunces 20px, gold on `bg/base` when focused.
- **A10 — Target size:** gallery prev/next arrows, counter dots, chip overflow arrows, modal close-X — all ≥44×44px tap targets.
- **A11 — Focus ring contrast verified:** gold vs `bg/base` ≈ 8.5:1; vs `bg/raised` ≈ 7.5:1 — clears AAA 3:1 state-contrast.

### Component inventory additions (from audit)

Append to the §11.6 list — carried in the §16.1 build order after the base set:
- **Modal (Request Callback)** — focus-trapped, Esc-close, `aria-labelledby`.
- **Form field + inline error** — label, hint, control, error row.
- **Error summary (top of form)** — appears when >1 error, links to each field.
- **Toast / snackbar** — status/success/error variants.
- **Skip-to-content link** — first focusable element on every page.

---

## Instructions to skills

**ui-ux-pro-max:** audit tokens against this file; propose accessibility raises only. **Do not propose brand-colour or type-scale changes.** Any such suggestion will be rejected on sight.

**frontend-design:** take tokens from `tailwind.config.ts` (generated from this file). Produce per-component code only; do not re-declare tokens inline.
