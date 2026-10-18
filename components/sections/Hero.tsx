// Home hero — PRD §11.5 + U1 decision.
// Desktop (≥lg): full-bleed photo, bottom-anchored copy, horizontally centered.
// Mobile (<lg):  text-first stacked for LCP; image below, 16:9, lazy below the fold.
//
// Hero image is passed in by the caller so this component stays presentational.
// A3-adjacent: aspect-ratio reserved on both breakpoints to kill CLS.

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappHref } from "@/lib/contact";

interface HeroProps {
  imageUrl: string;
  imageAlt: string;
  headline: string;
  sub: string;
  primaryCta?: { label: string; href: string };
}

export function Hero({
  imageUrl,
  imageAlt,
  headline,
  sub,
  primaryCta,
}: HeroProps) {
  return (
    <>
      {/* Mobile: text-first stacked. */}
      <section className="lg:hidden bg-bg-base">
        <div className="px-4 pt-10 pb-6">
          <h1 className="font-display text-h1-m text-text-primary tracking-[-0.01em] max-w-[22ch]">
            {headline}
          </h1>
          <p className="mt-5 text-body-m text-text-secondary max-w-[32ch]">{sub}</p>
          <div className="mt-7 flex gap-3">
            {primaryCta ? (
              <Button as="a" href={primaryCta.href}>{primaryCta.label}</Button>
            ) : (
              <Button
                as="a"
                href={whatsappHref()}
                target="_blank"
                rel="noopener"
                leading={<WhatsAppIcon className="h-5 w-5" />}
              >
                Talk to the advisor
              </Button>
            )}
          </div>
        </div>
        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Desktop: full-bleed, bottom-anchored. */}
      <section className="hidden lg:block relative overflow-hidden bg-bg-sunken">
        <div className="relative w-full" style={{ aspectRatio: "16 / 7.2" }}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Overlay recipe per §11.5 */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(6,6,7,0.82) 0%, rgba(6,6,7,0.35) 45%, rgba(6,6,7,0.05) 75%, transparent 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-[1280px] px-8 pb-20 flex flex-col items-center text-center">
              <h1 className="font-display text-h1-d text-text-primary tracking-[-0.01em] max-w-[18ch]">
                {headline}
              </h1>
              {/* Gold hairline between title and sub, per §11.5 */}
              <div aria-hidden className="my-6 h-px w-16 bg-brand-gold" />
              <p className="text-body-d text-text-primary/90 max-w-[52ch]">{sub}</p>
              <div className="mt-9">
                {primaryCta ? (
                  <Button as="a" href={primaryCta.href} className="px-7">
                    {primaryCta.label}
                  </Button>
                ) : (
                  <Button
                    as="a"
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener"
                    className="px-7"
                    leading={<WhatsAppIcon className="h-5 w-5" />}
                  >
                    Talk to the advisor
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
