import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    // Deliberately NOT extending the default palette — the whole theme is custom.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      base: "#0A0A0B", // page background
      surface: "#0D0D10", // cards / raised panels
      raised: "#131318", // hover state of panels
      line: "#1E1E24", // hairline borders
      ink: {
        DEFAULT: "#E8E8EA", // primary text
        dim: "#9A9AA3", // secondary text
        faint: "#5B5B66", // captions / disabled
      },
      signal: {
        DEFAULT: "#39FF88", // acid green — links, hovers, the graph
        dim: "rgba(57,255,136,0.12)",
      },
      chaos: {
        DEFAULT: "#FFB454", // amber — reserved for latency/chaos metrics only
        dim: "rgba(255,180,84,0.12)",
      },
    },
    fontFamily: {
      mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
    },
    extend: {
      maxWidth: {
        wrap: "72rem",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
