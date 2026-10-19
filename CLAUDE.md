## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary, applied as a `Status:` line in each issue file. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.


## Skill Priority
From now on, do NOT use these Superpower skills — they conflict with Matt Pocock workflow:
- superpowers:writing-plans
- superpowers:executing-plans  
- superpowers:subagent-driven-development
- superpowers:verification-before-completion
- superpowers:finishing-a-development-branch

ONLY use Matt Pocock skills for planning, implementation, testing, and PRs.
Keep using superpowers:ui-ux-pro-max and superpowers:frontend-design alongside Matt Pocock skills.


## Visual + Browser Verification (non-negotiable)

Standing rule for EVERY ticket, feature, and fix — not just the next one. This
layers on top of the unit/component/handler tests in `.scratch/phase-1-mvp/spec.md`;
it does not replace them. It verifies the running UI against `docs/design-system.md`
and PRD §7 (page spec), §11 (design direction), and §12 (non-functional reqs).

### Rule 1 — Verify at the PAGE level, not the component level

A single component (Button, Card, Chip) never triggers a browser pass on its own.
Browser verification fires when a complete, user-facing, routable page is finished:
Home, City, Category Listing, Property Detail, About, Contact, Privacy, Terms, Blog
Index, Blog Post, not-found, error. "Finished" = every section PRD §7 requires for
that page is implemented, wired to real data through `lib/data.ts`, and the page
renders end-to-end with no placeholder blocks.

Why: component-level verification burns tokens on surfaces that change again as
neighbouring components land. Page-level verification catches the real defects —
composition, hierarchy, responsive behaviour, visual rhythm — that only surface once
the full page is assembled.

### Rule 2 — When to run the pass

Run it when:
- A ticket (or a group of related tickets) completes a whole page end-to-end.
- A shipped page is modified in a way that could affect layout, hierarchy, or any
  token — even a "small" style change.
- Before the git commit that marks the page as done.

Do NOT run it:
- After an isolated component that isn't yet mounted in a complete page.
- After pure logic changes in `lib/`, `data/`, `scripts/`, config, or test files.
- After copy-only changes to an already-verified page (but DO reload once and glance
  to confirm layout didn't break).

A shared component (e.g. a Button used across many pages) is covered by its component
tests; its browser verification happens the next time any page that uses it is verified.

### Rule 3 — Which browser tool

Default: Claude in Chrome (the extension on the user's real Chrome, `mcp__claude-in-chrome__*`).
Load the chrome-browser skill before the first browser call of the session, and batch
every browser tool you need into ONE ToolSearch call per the skill. Open a NEW tab for
verification — never touch the user's other tabs.

Fallback if Chrome is unavailable: the built-in browser (`mcp__Claude_Browser__*` or
`mcp__remote-devices__Claude_Browser__*`); load the built-in-browser skill. If neither
is available, STOP and tell the user — do not commit.

### Rule 4 — What to check during a page pass

Viewports (whole page at each, minimum):
- Mobile 380×820 (primary audience is 80% mobile)
- Tablet 820×1180
- Desktop 1440×900

At each viewport, verify against `docs/design-system.md` and PRD §11:
- Tokens only: no raw hex, no Tailwind defaults — only §11.2 colors, §11.3 type scale,
  §11.4 spacing/radius.
- Type rules: Fraunces only at ≥20px; gold never body copy; `text/muted` only at ≥14pt.
- Hover + focus on every interactive element (focus ring = solid gold + 2px `bg/base`
  offset, §11.2).
- Tap targets ≥44×44px with ≥8px gap (§11.8).
- Icon-only buttons carry `aria-label`.
- Mobile-first: no horizontal scroll, no overflow; sticky bottom CTA bar renders
  site-wide on mobile.
- Motion: GSAP desktop-only, mobile CSS-only, `prefers-reduced-motion` honored.
- Hero / LCP element renders without layout shift; aspect-ratio reserved.
- Section rhythm per PRD §7 for that page (correct order and presence of every
  required section).

Also read the DevTools console (`read_console_messages`) and report any warnings/errors.

### Rule 5 — Use the skills, plugins, and MCPs that are available

Before starting any page-completing ticket, check what's available this session and
prefer these where they fit:
- superpowers:ui-ux-pro-max — layout, spacing, hierarchy, interaction during BUILD.
- superpowers:frontend-design — component visual design during BUILD.
- chrome-browser skill — every browser interaction (load before first call).
- built-in-browser skill — fallback when Chrome isn't available.
- Any listed shadcn/ui skill or MCP.
- Any accessibility-checking tool in the tool list.

If a listed skill/plugin/MCP fits the ticket, use it. Don't reinvent its work.

### Rule 6 — Fix what you find, then re-verify

Fix defects a pass surfaces in the same session. After each fix:
1. Reload the tab (same URL).
2. Re-screenshot only the viewport the defect was in (not all three).
3. Confirm it's resolved.

After all defects are resolved, do one final full three-viewport sweep to confirm the
page is clean.

If a fix would reach outside the ticket's scope (e.g. a brand token in
`tailwind.config.ts`, or a shared layout component the ticket doesn't own), STOP and
ask the user before proceeding — do not silently expand scope.

### Rule 7 — Never commit untested or unverified work

Before any `git commit` that includes a page-completing change:
- `pnpm test` green (unit + component).
- `pnpm run prebuild` green (data validators, if applicable).
- Page-level browser verification (Rules 1–4) complete.
- Defects either fixed or explicitly deferred with the user's approval.

For commits that don't complete or modify a page (data layer, build scripts, pure
`lib/` logic, config, isolated components not yet wired into a page), skip the browser
pass — but tests and prebuild must still be green.

If any applicable check isn't satisfied: do not `git commit`, do not suggest the user
run it, and do not call the ticket complete. Report what's blocking and ask.