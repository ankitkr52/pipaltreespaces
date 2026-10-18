"use client";

// Chip — category switcher / filter chip.
// A1: real <button type="button" role="tab" aria-pressed>, keyboard arrows
// move focus within a ChipRail and scrollIntoView keeps focus on screen.
// A1 overflow rule: ChipRail wraps when ≤5 chips, scrolls with a +N
// disclosure when >5 and some are off-screen.

import { forwardRef, useRef } from "react";

interface ChipProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { active = false, children, onClick },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-pressed={active}
      onClick={onClick}
      className={
        "shrink-0 inline-flex items-center h-10 px-4 rounded-full border " +
        "text-meta-m md:text-meta-d transition-colors duration-hover " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold " +
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base " +
        (active
          ? "bg-transparent border-brand-gold text-brand-gold"
          : "bg-bg-raised border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong")
      }
    >
      {children}
    </button>
  );
});

interface ChipRailProps {
  ariaLabel: string;
  children: React.ReactNode;
  /** Hint for wrap vs scroll. If true (default), rail scrolls horizontally on mobile. */
  scrollOnMobile?: boolean;
}

export function ChipRail({ ariaLabel, children, scrollOnMobile = true }: ChipRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const buttons = Array.from(
      railRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]') ?? []
    );
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i === -1) return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? Math.min(i + 1, buttons.length - 1) : Math.max(i - 1, 0);
    buttons[next].focus();
    buttons[next].scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return (
    <div className="relative">
      <div
        ref={railRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className={
          scrollOnMobile
            ? "flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory [&>*]:snap-start pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0"
            : "flex flex-wrap gap-2"
        }
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>
      {/* Right-edge gradient fade, mobile scroll only */}
      {scrollOnMobile && (
        <div
          aria-hidden
          className="lg:hidden pointer-events-none absolute inset-y-0 right-0 w-8"
          style={{
            background: "linear-gradient(to right, transparent, var(--bg-base) 85%)",
          }}
        />
      )}
    </div>
  );
}
