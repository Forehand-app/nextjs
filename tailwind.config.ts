import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Work around transient Windows/OneDrive EBUSY lock on this route file during scan.
    "!./app/tournaments/[[]id[]]/checkout/page.tsx",
    "!./app/tournaments/[[]id[]]/page.tsx", // <--- Add this line
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        heading: ["Zalando Sans", "var(--font-dm-sans)", "DM Sans", "sans-serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      colors: {
        // Brand
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-contrast": "var(--color-primary-contrast)",

        // Backgrounds
        background: "var(--color-background)",
        "screen-bg": "var(--color-screen-bg)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        "nav-panel": "var(--color-nav-panel)",
        chip: "var(--color-chip)",

        // Text
        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
        muted: "var(--color-muted)",
        placeholder: "var(--color-placeholder)",

        // Borders & decorations
        border: "var(--color-border)",
        dot: "var(--color-dot)",

        // Semantic states
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)",
        input: "var(--radius-input)",
        badge: "var(--radius-badge)",
        avatar: "var(--radius-avatar)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        nav: "var(--shadow-nav)",
        "nav-float": "var(--shadow-nav-float)",
      },
    },
  },
  plugins: [],
};

export default config;
