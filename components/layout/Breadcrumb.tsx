// Breadcrumb — Home › City › … trail. Rendered on /[city], /[city]/[category],
// /[city]/[category]/[slug] and /blog/[slug] (tickets 06–08, 09).
//
// The trail is plain, JSON-LD-serializable data ({ label, href }[]) so ticket 11
// (lib/jsonld.breadcrumbList) can emit BreadcrumbList from the same array.
// §11.6: ancestors text/secondary, current page text/primary, "›" in brand/bronze.

import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-[1280px] px-4 pt-6 lg:px-8">
      <ol className="flex flex-wrap items-center gap-y-1 text-meta-m md:text-meta-d">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="text-text-secondary transition-colors duration-hover hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-sm"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-text-primary" aria-current={last ? "page" : undefined}>
                  {c.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className="mx-2 text-brand-bronze">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
