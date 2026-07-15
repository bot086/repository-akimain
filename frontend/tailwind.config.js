/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F7F3EC",
          warm:    "#F2EDE3",
          soft:    "#FAF8F4",
          border:  "#E8E0D0",
        },
        gold: {
          DEFAULT: "#C4952A",
          light:   "#E8C97A",
          muted:   "#A07830",
          dark:    "#7A5C1E",
          pale:    "#F0E4C4",
          shine:   "#FFD97D",
        },
        ink: {
          DEFAULT: "#1C1916",
          soft:    "#3A3530",
          muted:   "#7A746E",
          faint:   "#B0AAA4",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans:  ["DM Sans", "Inter", "system-ui", "sans-serif"],
        mono:  ["DM Mono", "monospace"],
      },
      animation: {
        "fade-up":     "fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in":     "fadeIn 0.7s ease forwards",
        "gold-shimmer":"goldShimmer 3s ease-in-out infinite",
        "line-grow":   "lineGrow 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        goldShimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        lineGrow: {
          "0%":   { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E8C97A 0%, #C4952A 40%, #A07830 100%)",
        "gold-shimmer":  "linear-gradient(90deg, #C4952A, #F0D080, #C4952A, #E8C97A, #C4952A)",
        "cream-gradient":"linear-gradient(160deg, #FAF8F4 0%, #F2EDE3 100%)",
      },
    },
  },
  plugins: [],
};
