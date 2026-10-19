# Merged `plotted-development` category with `plotSubtype` toggle

In practice the advisor sells plotted-development plots (layout projects) and standalone plots as one buying decision — "land you can build on". We merged the two into a single category `plotted-development` at URL `/[city]/plotted-development`, with a `plotSubtype: 'plotted-development' | 'standalone'` field on each plot and a listing-page sub-type toggle for buyers who want to narrow. Old `/[city]/plots` URLs 301 to the merged path via Cloudflare `_redirects`. Split-again trigger: either sub-type crosses ~20 listings in a city *and* keyword research shows SEO uplift from a split.

---

**Amendment (2026-10-19, carried from PRD v2.1):** redirect mechanism updated from Cloudflare `_redirects` to `next.config.ts` `async redirects()` (version-controlled, works in `next dev`, works through `@cloudflare/next-on-pages`, no platform-only file). The category merge and `plotSubtype` design are unchanged.
