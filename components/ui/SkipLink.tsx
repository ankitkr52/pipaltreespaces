// A9 — skip-to-content link. First focusable element on every page.
// Visually hidden until focus; then it becomes a prominent gold pill.

export function SkipLink() {
  return (
    <a
      href="#main"
      className={
        "sr-only focus:not-sr-only " +
        "focus:fixed focus:top-3 focus:left-3 focus:z-[100] " +
        "focus:inline-flex focus:items-center focus:px-4 focus:py-2 " +
        "focus:rounded-full focus:bg-brand-gold focus:text-bg-base " +
        "focus:font-display focus:text-h3-m focus:no-underline"
      }
    >
      Skip to content
    </a>
  );
}
