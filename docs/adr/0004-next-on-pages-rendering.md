# Native Next.js on Cloudflare Pages via `@cloudflare/next-on-pages`

**Supersedes:** ADR-0002 (the `output: 'export'` + "no API routes" half; the JSON/MDX-content-no-CMS half carries forward unchanged).

The site builds and ships as native Next.js on Cloudflare Pages using `@cloudflare/next-on-pages`. All page routes are pre-generated at build time via `generateStaticParams` (same `/data/*.json` + MDX sources as before, same crawl + edge-cache characteristics). One edge route handler lives at `/app/api/callback/route.ts` (`runtime = 'edge'`) and backs the Request Callback form via Resend; no session, no DB, no other server surface.

Reversed from ADR-0002 because the "no API routes" posture forced the lead-form fallback onto Web3Forms, which costs trust (3rd-party domain in the submit URL) and blocks per-IP rate limiting at our edge. `next-on-pages` keeps the Cloudflare Pages free tier, keeps the SSG-first build, and unlocks (a) first-party `/api/callback` + Resend, (b) `next.config.ts` `async redirects()` for the retired `/[city]/plots` URLs, (c) dynamic OG later if the Cloudinary named-transformation ever stops being enough, (d) optional ISR after launch without a platform migration.

Build command: `npx @cloudflare/next-on-pages`. Output: `.vercel/output/static`. Node 20+. `nodejs_compat` flag enabled in Pages dashboard / `wrangler.toml`. Pin `next` + `@cloudflare/next-on-pages` versions pair-wise in `package.json`; the adapter breaks on Next minor bumps if upgraded independently.

Revisit if the catalogue crosses ~500 properties (deploy file count, not route count, is the ceiling), if a non-developer needs to publish without a build, or if the adapter stops tracking Next upstream.
