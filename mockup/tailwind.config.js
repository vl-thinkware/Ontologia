/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    // Exclude the cloud-sync shadow duplicates (permissions can fail).
    "!./src/**/* 2.tsx",
    "!./src/**/* 2.ts",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f1ff",
          100: "#ebe6ff",
          200: "#d9d1ff",
          300: "#bdadff",
          400: "#9b81ff",
          500: "#7c56fc",
          600: "#6a38f2",
          700: "#5a26de",
          800: "#4b21b6",
          900: "#3f1e94",
          950: "#261061",
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.08)",
        pop: "0 10px 30px -10px rgb(15 23 42 / 0.18), 0 4px 8px -4px rgb(15 23 42 / 0.08)",
        focus: "0 0 0 3px rgb(124 86 252 / 0.22)",
      },
      borderRadius: {
        xl: "0.875rem",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    },
  },
  plugins: [],
};
