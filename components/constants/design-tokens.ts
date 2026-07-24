export const designTokens = {
  colors: {
    background: {
      default: "#05070b",
      muted: "#0b1018",
      elevated: "#121826",
      card: "rgba(255,255,255,0.06)",
    },
    foreground: {
      default: "#f8fafc",
      muted: "#94a3b8",
      subtle: "#64748b",
    },
    accent: {
      primary: "#ff3d5a",
      secondary: "#7c3aed",
      tertiary: "#38bdf8",
    },
    border: "rgba(255,255,255,0.12)",
  },
  typography: {
    fontFamily: {
      sans: "var(--font-geist-sans)",
      mono: "var(--font-geist-mono)",
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.5rem",
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 800,
    },
  },
  spacing: {
    0: "0px",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 4px 20px rgba(0,0,0,0.16)",
    md: "0 10px 35px rgba(0,0,0,0.24)",
    lg: "0 20px 60px rgba(0,0,0,0.3)",
    glow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(255,61,90,0.2)",
  },
  animation: {
    duration: {
      fast: "150ms",
      normal: "250ms",
      slow: "400ms",
    },
    easing: {
      standard: "cubic-bezier(0.2,0.8,0.2,1)",
    },
  },
} as const;
