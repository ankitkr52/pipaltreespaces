// Site-wide mobile sticky CTA bar (hidden ≥lg).
// A2: bar height is published as a CSS var so body `scroll-padding-bottom`
// can keep focused elements from being obscured.
//
// Mounted once in app/layout.tsx. It derives the current property from the
// URL (a 3-segment /[city]/[category]/[slug] path) so the WhatsApp message is
// pre-filled on a property page and generic everywhere else — one mount, no
// per-page wiring. `property` can still be passed to override (tests, previews).
// ponytail: client-resolves via the data layer (18 records); fine at this size.
"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, PhoneIcon } from "@/components/ui/icons";
import { whatsappHref, telHref } from "@/lib/contact";
import { getProperty } from "@/lib/data";
import type { Property, CitySlug, CategorySlug } from "@/lib/types";

function propertyFromPath(pathname: string): Property | undefined {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 3) return undefined;
  const [city, category, slug] = parts;
  return getProperty(city as CitySlug, category as CategorySlug, slug);
}

export function MobileStickyCta({ property }: { property?: Property }) {
  const pathname = usePathname();
  const active = property ?? propertyFromPath(pathname ?? "");

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-bg-sunken/95 backdrop-blur-md border-t border-border-subtle"
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex gap-2 px-4 pt-3">
        <Button
          as="a"
          href={telHref}
          variant="secondary"
          className="flex-1"
          leading={<PhoneIcon className="h-5 w-5" />}
        >
          Call
        </Button>
        <Button
          as="a"
          href={whatsappHref(active)}
          variant="primary"
          className="flex-[1.3]"
          target="_blank"
          rel="noopener"
          leading={<WhatsAppIcon className="h-5 w-5" />}
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
