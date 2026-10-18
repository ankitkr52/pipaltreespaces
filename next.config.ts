import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudinary as source; next/image optimizes via next-on-pages.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    // §9.1 — retired slug kept alive for SEO equity.
    const CITIES = ["patna", "pune", "gaya"];
    return CITIES.map((c) => ({
      source: `/${c}/plots`,
      destination: `/${c}/plotted-development`,
      permanent: true,
    }));
  },
  experimental: {
    mdxRs: true,
  },
};

export default config;
