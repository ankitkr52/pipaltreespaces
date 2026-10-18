"use client";

// Global nav — PRD §7 "Global nav" + §11.6.
// Desktop (≥1024px): logo-left · center links (Home · Cities ▾ · About · Blog) · Call + WhatsApp right.
// Mobile (<1024px):  logo-left · hamburger-right. Hamburger opens a full-screen panel.
// A2: sticky top with blur; nav never last-in-tab-order.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, PhoneIcon, MenuIcon, CloseIcon, ChevronDownIcon } from "@/components/ui/icons";
import { whatsappHref, telHref } from "@/lib/contact";

const CITIES: Array<{ slug: string; label: string }> = [
  { slug: "patna", label: "Patna" },
  { slug: "pune", label: "Pune" },
  { slug: "gaya", label: "Gaya" },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const citiesBtnRef = useRef<HTMLButtonElement>(null);
  const citiesMenuRef = useRef<HTMLDivElement>(null);

  // Close cities dropdown on outside click + Esc.
  useEffect(() => {
    if (!citiesOpen) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        !citiesBtnRef.current?.contains(t) &&
        !citiesMenuRef.current?.contains(t)
      ) {
        setCitiesOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setCitiesOpen(false);
        citiesBtnRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [citiesOpen]);

  // Lock body scroll while mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-bg-base/85 backdrop-blur-md border-b border-border-subtle">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between px-4 lg:h-[72px] lg:px-8"
      >
        <Link
          href="/"
          className="font-display text-h3-m lg:text-h3-d text-brand-gold tracking-[-0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-sm"
        >
          Pipaltreespaces
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8 text-text-primary text-btn-d">
          <li>
            <Link href="/" className="hover:text-brand-gold transition-colors duration-hover">Home</Link>
          </li>
          <li className="relative">
            <button
              ref={citiesBtnRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={citiesOpen}
              onClick={() => setCitiesOpen((v) => !v)}
              className="inline-flex items-center gap-1 hover:text-brand-gold transition-colors duration-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-sm"
            >
              Cities
              <ChevronDownIcon className={"h-4 w-4 transition-transform " + (citiesOpen ? "rotate-180" : "")} />
            </button>
            {citiesOpen && (
              <div
                ref={citiesMenuRef}
                role="menu"
                className="absolute left-0 top-full mt-3 min-w-[200px] rounded-xl bg-bg-raised border border-border-subtle shadow-lift-inner p-2"
              >
                {CITIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    role="menuitem"
                    onClick={() => setCitiesOpen(false)}
                    className="block rounded-lg px-3 py-2 text-text-primary hover:bg-bg-base hover:text-brand-gold"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
          <li>
            <Link href="/about" className="hover:text-brand-gold transition-colors duration-hover">About</Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-brand-gold transition-colors duration-hover">Blog</Link>
          </li>
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Button as="a" href={telHref} variant="secondary" size="sm" leading={<PhoneIcon className="h-4 w-4" />}>
            Call
          </Button>
          <Button
            as="a"
            href={whatsappHref()}
            variant="primary"
            size="sm"
            target="_blank"
            rel="noopener"
            leading={<WhatsAppIcon className="h-4 w-4" />}
          >
            WhatsApp
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-text-primary hover:bg-bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 bg-bg-base flex flex-col"
        >
          <div className="flex items-center justify-between px-4 h-[60px] border-b border-border-subtle">
            <span className="font-display text-h3-m text-brand-gold tracking-[-0.01em]">Pipaltreespaces</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-text-primary hover:bg-bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1 text-text-primary">
            <MobileLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
            <li className="mt-4 mb-2 px-3 text-meta-m text-text-secondary">Cities</li>
            {CITIES.map((c) => (
              <MobileLink key={c.slug} href={`/${c.slug}`} onClick={() => setMenuOpen(false)}>
                {c.label}
              </MobileLink>
            ))}
            <li className="mt-4" />
            <MobileLink href="/about" onClick={() => setMenuOpen(false)}>About</MobileLink>
            <MobileLink href="/blog" onClick={() => setMenuOpen(false)}>Blog</MobileLink>
            <MobileLink href="/contact" onClick={() => setMenuOpen(false)}>Contact</MobileLink>
          </ul>
          <div className="p-4 border-t border-border-subtle flex gap-3" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
            <Button as="a" href={telHref} variant="secondary" className="flex-1" leading={<PhoneIcon className="h-5 w-5" />}>
              Call
            </Button>
            <Button
              as="a"
              href={whatsappHref()}
              variant="primary"
              className="flex-1"
              target="_blank"
              rel="noopener"
              leading={<WhatsAppIcon className="h-5 w-5" />}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="block rounded-lg px-3 py-3 text-h3-m hover:bg-bg-raised hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      >
        {children}
      </Link>
    </li>
  );
}
