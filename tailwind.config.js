/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ['"JetBrains Mono"', 'monospace'],
        heading: ['"JetBrains Mono"', 'monospace'],
        body: ['"IBM Plex Mono"', 'monospace'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        nav: ['"JetBrains Mono"', 'monospace'],
        jetbrains: ['"JetBrains Mono"', 'monospace'],
        ibm: ['"IBM Plex Mono"', 'monospace'],
        inconsolata: ['"Inconsolata"', 'monospace'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        glow: "0 4px 20px rgba(51, 204, 255, 0.08)",
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "c1": {
          "0%": { clipPath: "inset(30% 0 10% 0)", transform: "translateX(-10px)" },
          "20%": { clipPath: "inset(50% 0 30% 0)", transform: "translateX(8px)" },
          "40%": { clipPath: "inset(10% 0 60% 0)", transform: "translateX(-4px)" },
          "60%": { clipPath: "inset(70% 0 5% 0)", transform: "translateX(12px)" },
          "80%": { clipPath: "inset(20% 0 40% 0)", transform: "translateX(-6px)" },
          "100%": { clipPath: "inset(30% 0 10% 0)", transform: "translateX(-10px)" },
        },
        "c2": {
          "0%": { clipPath: "inset(10% 0 50% 0)", transform: "translateX(8px)" },
          "20%": { clipPath: "inset(60% 0 20% 0)", transform: "translateX(-12px)" },
          "40%": { clipPath: "inset(30% 0 40% 0)", transform: "translateX(6px)" },
          "60%": { clipPath: "inset(80% 0 10% 0)", transform: "translateX(-8px)" },
          "80%": { clipPath: "inset(15% 0 70% 0)", transform: "translateX(10px)" },
          "100%": { clipPath: "inset(10% 0 50% 0)", transform: "translateX(8px)" },
        },
        "c3": {
          "0%": { clipPath: "inset(70% 0 15% 0)", transform: "translateX(-6px)" },
          "20%": { clipPath: "inset(20% 0 60% 0)", transform: "translateX(10px)" },
          "40%": { clipPath: "inset(50% 0 25% 0)", transform: "translateX(-8px)" },
          "60%": { clipPath: "inset(5% 0 80% 0)", transform: "translateX(4px)" },
          "80%": { clipPath: "inset(40% 0 35% 0)", transform: "translateX(-12px)" },
          "100%": { clipPath: "inset(70% 0 15% 0)", transform: "translateX(-6px)" },
        },
        "c4": {
          "0%": { clipPath: "inset(40% 0 30% 0)", transform: "translateX(12px)" },
          "20%": { clipPath: "inset(15% 0 65% 0)", transform: "translateX(-6px)" },
          "40%": { clipPath: "inset(75% 0 10% 0)", transform: "translateX(8px)" },
          "60%": { clipPath: "inset(25% 0 50% 0)", transform: "translateX(-10px)" },
          "80%": { clipPath: "inset(55% 0 30% 0)", transform: "translateX(4px)" },
          "100%": { clipPath: "inset(40% 0 30% 0)", transform: "translateX(12px)" },
        },
        "bar-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "c1": "c1 0.3s linear infinite",
        "c2": "c2 0.3s linear infinite reverse",
        "c3": "c3 0.3s linear infinite",
        "c4": "c4 0.3s linear infinite",
        "bar-fill": "bar-fill 1.2s ease-out forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
