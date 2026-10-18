// Global footer — PRD §7 "Global footer".
// 4-col desktop; collapses to a single column on mobile, column order preserved.
// On dark; no shadows, lift-inner optional. One hairline bronze divider only
// above the copyright strip — nowhere else.

import Link from "next/link";
import { WhatsAppIcon, PhoneIcon } from "@/components/ui/icons";
import { PHONE } from "@/lib/contact";

const MAIN_PAGES = [
  { href: "/", label: "Home" },
  { href: "/patna", label: "Patna" },
  { href: "/pune", label: "Pune" },
  { href: "/gaya", label: "Gaya" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const OTHER_PAGES = [
  { href: "/blog", label: "Blog" },
  { href: "/emi-calculator", label: "EMI Calculator" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="bg-bg-sunken text-text-secondary">
      <div className="mx-auto max-w-[1280px] px-4 py-16 lg:px-8 lg:py-24 grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-12">
        <div>
          <Link href="/" className="font-display text-h3-d text-brand-gold tracking-[-0.01em]">
            Pipaltreespaces
          </Link>
          <p className="mt-4 text-body-m text-text-secondary max-w-xs">
            Land and property guidance in Patna, Pune and Gaya — the one call that saves you the next ten site visits.
          </p>
        </div>

        <FooterColumn title="Main pages" links={MAIN_PAGES} />
        <FooterColumn title="Other pages" links={OTHER_PAGES} />

        <div>
          <h3 className="font-display text-h3-m text-text-primary">Reach us</h3>
          <ul className="mt-4 space-y-3 text-body-m">
            <li>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 text-text-primary hover:text-brand-gold transition-colors duration-hover"
              >
                <PhoneIcon className="h-4 w-4 text-brand-bronze" />
                {PHONE}
              </a>
            </li>
            <li>
              <a
                href="mailto:advisor@pipaltreespaces.com"
                className="text-text-primary hover:text-brand-gold transition-colors duration-hover break-all"
              >
                advisor@pipaltreespaces.com
              </a>
            </li>
            <li className="text-text-secondary">
              Office address — to be confirmed with client
            </li>
            <li className="text-text-muted text-meta-m">Mon–Sat · 10:00–19:00 IST</li>
          </ul>
          <div className="mt-6 flex items-center gap-3 text-text-secondary">
            <SocialIcon label="Instagram" href="https://instagram.com/">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Facebook" href="https://facebook.com/">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4v2.4H7.6V14h2.8v8h3.1z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="WhatsApp" href="https://wa.me/">
              <WhatsAppIcon className="h-5 w-5" />
            </SocialIcon>
          </div>
        </div>
      </div>

      {/* Single bronze hairline above copyright — the only divider in the footer */}
      <div className="mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="border-t border-brand-bronze/40 py-6 text-meta-m text-text-muted flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Pipaltreespaces. All rights reserved.</span>
          <span>Prices indicative, subject to change. RERA numbers displayed on each listing.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="font-display text-h3-m text-text-primary">{title}</h3>
      <ul className="mt-4 space-y-3 text-body-m">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-text-secondary hover:text-brand-gold transition-colors duration-hover"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle text-text-secondary hover:text-brand-gold hover:border-brand-gold transition-colors duration-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-sunken"
    >
      {children}
    </a>
  );
}
