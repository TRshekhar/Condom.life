/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        cream: {
          50: "#fefdf8",
          100: "#fdf9ed",
          200: "#f9f0d3",
          300: "#f3e4af",
          400: "#ead07f",
          500: "#deaf55",
        },
        ink: {
          900: "#0d0d0d",
          800: "#1a1a1a",
          700: "#262626",
          600: "#404040",
          500: "#595959",
        },
        rose: {
          brand: "#e8526a",
          dark: "#c43a52",
          light: "#f08090",
          pale: "#fde8ec",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "slide-in": "slideIn 0.4s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};