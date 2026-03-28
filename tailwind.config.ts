import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#974730",
        "on-primary": "#ffdbd1",
        "primary-container": "#6a2511",
        "on-primary-container": "#ffffff",
        "primary-fixed": "#974730",
        "primary-fixed-dim": "#79301b",
        "on-primary-fixed": "#ffffff",
        "on-primary-fixed-variant": "#ffdbd1",

        secondary: "#5f5e5e",
        "on-secondary": "#ffffff",
        "secondary-container": "#d6d4d3",
        "on-secondary-container": "#1c1b1b",
        "secondary-fixed": "#c8c6c5",
        "secondary-fixed-dim": "#adabaa",
        "on-secondary-fixed": "#1c1b1b",
        "on-secondary-fixed-variant": "#3c3b3b",

        tertiary: "#3a3c3c",
        "on-tertiary": "#e2e2e2",
        "tertiary-container": "#737575",
        "on-tertiary-container": "#ffffff",
        "tertiary-fixed": "#5d5f5f",
        "tertiary-fixed-dim": "#454747",
        "on-tertiary-fixed": "#ffffff",
        "on-tertiary-fixed-variant": "#e2e2e2",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#410002",

        background: "#f9f9f9",
        "on-background": "#1a1c1c",

        surface: "#f9f9f9",
        "on-surface": "#1a1c1c",
        "surface-dim": "#dadada",
        "surface-bright": "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f4",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "surface-variant": "#e2e2e2",
        "on-surface-variant": "#474747",
        "surface-tint": "#974730",

        outline: "#777777",
        "outline-variant": "#c6c6c6",

        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f0f1f1",
        "inverse-primary": "#ffb5a1",
      },
      fontFamily: {
        headline: ["Noto Serif", "serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0px",
        lg: "0px",
        xl: "0px",
      },
    },
  },
  plugins: [],
};

export default config;
