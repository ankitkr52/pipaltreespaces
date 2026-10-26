// Property gallery. One index drives both the inline hero and the lightbox.
// Mobile: swipe (touch) + dot indicators. Desktop: prev/next arrows + counter
// overlay. Tap the hero to open the lightbox; Esc (or the close button) closes it.
// Hero reserves a 16/9 box so the LCP image lands without layout shift.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloseIcon, ChevronDownIcon } from "@/components/ui/icons";

export function Gallery({
  images,
  title,
  locality,
}: {
  images: string[];
  title: string;
  locality: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);

  const count = images.length;
  const alt = `${title} — ${locality}`;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  // Esc closes the lightbox; arrows navigate while it is open.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, go]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    swiped.current = Math.abs(dx) > 40;
    if (swiped.current) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <>
      {/* Inline hero — reserves 16/9 to prevent CLS */}
      <div className="relative w-full overflow-hidden rounded-card bg-bg-raised" style={{ aspectRatio: "16 / 9" }}>
        <button
          type="button"
          onClick={() => {
            // A swipe ends in a click too — don't open the lightbox on swipe.
            if (swiped.current) {
              swiped.current = false;
              return;
            }
            setLightbox(true);
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-label="Open photo in full screen"
          className="absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          <Image
            src={images[index]}
            alt={alt}
            fill
            priority
            sizes="(min-width:1024px) 800px, 100vw"
            className="object-cover"
          />
        </button>

        {/* Desktop prev/next arrows */}
        {count > 1 && (
          <>
            <ArrowButton side="left" onClick={() => go(-1)} />
            <ArrowButton side="right" onClick={() => go(1)} />
            {/* Counter overlay (desktop) */}
            <span className="pointer-events-none absolute bottom-3 right-3 hidden rounded-full bg-bg-sunken/80 px-3 py-1 text-meta-d tabular-nums text-text-primary lg:block">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* Mobile dot indicators */}
      {count > 1 && (
        <div className="mt-3 flex justify-center gap-1 lg:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              className="flex h-11 w-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              <span
                className={
                  "h-1.5 rounded-full transition-all duration-hover " +
                  (i === index ? "w-5 bg-brand-gold" : "w-1.5 bg-border-strong")
                }
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photo ${index + 1} of ${count}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-sunken/95 backdrop-blur-sm"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close full screen"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-bg-raised text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <div className="relative h-[80vh] w-[92vw] max-w-5xl">
            <Image src={images[index]} alt={alt} fill sizes="92vw" className="object-contain" />
          </div>

          {count > 1 && (
            <>
              <ArrowButton side="left" onClick={() => go(-1)} inLightbox />
              <ArrowButton side="right" onClick={() => go(1)} inLightbox />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-bg-raised px-3 py-1 text-meta-d tabular-nums text-text-primary">
                {index + 1} / {count}
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
}

function ArrowButton({
  side,
  onClick,
  inLightbox,
}: {
  side: "left" | "right";
  onClick: () => void;
  inLightbox?: boolean;
}) {
  const pos = side === "left" ? "left-3" : "right-3";
  const visibility = inLightbox ? "flex" : "hidden lg:flex";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 -translate-y-1/2 ${pos} ${visibility} h-11 w-11 items-center justify-center rounded-full bg-bg-sunken/80 text-text-primary transition-colors duration-hover hover:bg-bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base`}
    >
      <ChevronDownIcon className={side === "left" ? "h-5 w-5 rotate-90" : "h-5 w-5 -rotate-90"} />
    </button>
  );
}
