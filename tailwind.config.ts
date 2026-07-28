import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aic: {
          void: "var(--aic-void)",
          "navy-deep": "var(--aic-navy-deep)",
          navy: "var(--aic-navy)",
          blue: "var(--aic-blue)",
          tech: "var(--aic-tech-blue)",
          ink: "var(--aic-ink)",
          muted: "var(--aic-muted)",
          mist: "var(--aic-mist)",
          line: "var(--aic-line)",
          gold: "var(--aic-gold)",
          "gold-dark": "var(--aic-gold-dark)",
          warm: "var(--aic-warm)",
          teal: "var(--aic-teal)",
          "teal-dark": "var(--aic-teal-dark)",
        },
      },
      borderRadius: { card: "22px", media: "24px", video: "28px", hero: "32px" },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        pill: "var(--shadow-pill-dark)",
        nested: "var(--shadow-nested)",
        "nested-hover": "var(--shadow-nested-hover)",
      },
      backgroundImage: {
        "hero-wash": "linear-gradient(rgba(0, 47, 81, 0.7), rgba(0, 47, 81, 0.7))",
        "hero-main": "linear-gradient(rgba(0, 47, 81, 0.4), rgba(0, 47, 81, 0.8))",
        /* Color-flow: deep navy hero bleeding down into flat white content */
        "flow-navy": "linear-gradient(180deg, var(--aic-void) 0%, var(--aic-navy) 100%)",
        "flow-seam": "linear-gradient(180deg, var(--aic-navy) 0%, #ffffff 100%)",
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "Inter", "system-ui", "sans-serif"],
        display: ["Be Vietnam Pro", "Inter", "system-ui", "sans-serif"],
        serif: ["Be Vietnam Pro", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Roboto Mono", "ui-monospace", "monospace"],
      },
      spacing: {
        /* Extreme section rhythm: 120px / 160px per the color-flow spec */
        30: "7.5rem",
        40: "10rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
