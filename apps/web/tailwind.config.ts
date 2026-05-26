import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── FreelanceHigh Canonical Palette ──
        // CSS-variable-driven for theming. Background = blanc, accent = vert #006e2f.
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          soft: "rgb(var(--color-primary-soft) / <alpha-value>)",
          hover: "#005425",
        },
        accent: "#f2b705",
        "background-light": "rgb(var(--color-bg-light) / <alpha-value>)",
        "background-subtle": "rgb(var(--color-bg-subtle) / <alpha-value>)",
        "background-muted": "rgb(var(--color-bg-muted) / <alpha-value>)",
        "background-dark": "rgb(var(--color-bg-dark) / <alpha-value>)",
        "neutral-dark": "rgb(var(--color-neutral-dark) / <alpha-value>)",
        "border-soft": "rgb(var(--color-border) / <alpha-value>)",
        "border-strong": "rgb(var(--color-border-strong) / <alpha-value>)",
        "border-dark": "rgb(var(--color-border-dark) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",

        // ── Brand alias for FreelanceHigh green ──
        // Usage: bg-fh-500, text-fh-700, ring-fh-600, etc.
        fh: {
          50: "#e8f3ec",
          100: "#c7e1d0",
          200: "#9fcdaf",
          300: "#71b88a",
          400: "#43a266",
          500: "#1a8b46",
          600: "#006e2f",  // canonical brand
          700: "#005425",
          800: "#003e1c",
          900: "#002814",
        },

        // shadcn/ui tokens — light theme blanc épuré
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        muted: {
          DEFAULT: "hsl(0 0% 98%)",          // stone-50
          foreground: "hsl(215.4 16.3% 46.9%)",
        },
        border: "hsl(220 13% 91%)",          // gray-200 sobre
        input: "hsl(220 13% 91%)",
        ring: "rgb(var(--color-primary) / <alpha-value>)",
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(210 40% 98%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
        },
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-from-right 0.3s ease-out",
        "marquee": "marquee 30s linear infinite",
        "pulse-fast": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
