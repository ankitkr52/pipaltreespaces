// Dead-end filter card: a centered raised card with two next steps — clear the
// filters, or hand it to the advisor on WhatsApp.

import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappHref } from "@/lib/contact";

export function EmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="mx-auto flex max-w-[48ch] flex-col items-center rounded-card border border-border-subtle bg-bg-raised px-6 py-14 text-center shadow-lift-inner">
      <h3 className="font-display text-h3-m md:text-h3-d text-text-primary">No properties match</h3>
      <p className="mt-3 text-body-m text-text-secondary">
        Nothing fits this combination of filters. Clear them to widen the search, or tell the advisor
        what you&apos;re after.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        {onClear && (
          <Button variant="secondary" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        )}
        <Button
          as="a"
          href={whatsappHref()}
          target="_blank"
          rel="noopener"
          size="sm"
          leading={<WhatsAppIcon className="h-5 w-5" />}
        >
          Talk to the advisor
        </Button>
      </div>
    </div>
  );
}
