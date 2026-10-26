// Root layout. Loads Fraunces + Inter via next/font with adjustFontFallback
// per A5. Mounts SkipLink → Nav → children (as <main id="main">) → Footer →
// MobileStickyCta. The sticky CTA is site-wide on mobile.

import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { SkipLink } from "@/components/ui/SkipLink";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-fraunces",
  display: "swap",
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pipaltreespaces.com"),
  title: {
    default: "Pipaltreespaces — Land and property advisor",
    template: "%s — Pipaltreespaces",
  },
  description:
    "Advisory for buyers of flats, plotted development and standalone plots in Patna, Pune and Gaya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} dark`}>
      <body className="min-h-dvh font-sans antialiased">
        <SkipLink />
        <Nav />
        <main id="main" className="pb-[calc(var(--sticky-cta-h)+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileStickyCta />
      </body>
    </html>
  );
}
