// Pipaltreespaces — Tailwind tokens (pinned to docs/design-system.md / PRD §11)
// This file is the source for brand colour, type scale, and spacing used by components.
// Any token change requires an edit to docs/design-system.md first.

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // brand is dark; class forces it, no OS auto-switch
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0B0B0D",
          raised: "#141418",
          sunken: "#060607",
        },
        border: {
          subtle: "#24242A",
          strong: "#3A3A42",
        },
        text: {
          primary: "#F2EFE8",
          secondary: "#A8A49C",
          muted: "#6B6862",
        },
        brand: {
          gold: "#C9A260",
          "gold-hover": "#D9B374",
          bronze: "#8A6A3A",
        },
        signal: {
          success: "#6FAE7A",
          warn: "#D9A14A",
          info: "#7FA2C9",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // mobile defaults; md: overrides provide desktop sizes in components
        "h1-m": ["36px", { lineHeight: "40px", letterSpacing: "-0.01em" }],
        "h1-d": ["64px", { lineHeight: "72px", letterSpacing: "-0.01em" }],
        "h2-m": ["28px", { lineHeight: "34px", letterSpacing: "-0.01em" }],
        "h2-d": ["44px", { lineHeight: "52px", letterSpacing: "-0.01em" }],
        "h3-m": ["20px", { lineHeight: "28px" }],
        "h3-d": ["24px", { lineHeight: "32px" }],
        "body-m": ["16px", { lineHeight: "26px" }],
        "body-d": ["17px", { lineHeight: "28px" }],
        "meta-m": ["13px", { lineHeight: "20px" }],
        "meta-d": ["14px", { lineHeight: "22px" }],
        "btn-m": ["15px", { lineHeight: "20px" }],
        "btn-d": ["16px", { lineHeight: "22px" }],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        // No drop shadows on dark — use the inner highlight instead
        "lift-inner": "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      fontFeatureSettings: {
        tnum: '"tnum"',
      },
      transitionDuration: {
        tap: "50ms",
        hover: "150ms",
        reveal: "400ms",
      },
    },
  },
  // Status-pill colours assembled from signal/* tokens must survive purge
  safelist: [
    "bg-signal-success",
    "bg-signal-warn",
    "bg-signal-info",
    "text-signal-success",
    "text-signal-warn",
    "text-signal-info",
  ],
  plugins: [],
};

export default config;
