// Site-wide mobile sticky CTA bar (hidden ≥lg).
// A2: bar height is published as a CSS var so body `scroll-padding-bottom`
// can keep focused elements from being obscured.

import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, PhoneIcon } from "@/components/ui/icons";
import { whatsappHref, telHref } from "@/lib/contact";
import type { Property } from "@/lib/types";

export function MobileStickyCta({ property }: { property?: Property }) {
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
          href={whatsappHref(property)}
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
