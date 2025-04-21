import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./theme.config.tsx"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      fontFamily: {
        sans: [
          `var(--font-sans, ${fontFamily.sans.slice(0, 3).join(", ")})`,
          ...fontFamily.sans,
        ],
        mono: [
          `var(--font-mono, ${fontFamily.mono.slice(0, 3).join(", ")})`,
          ...fontFamily.mono,
        ],
      },
      colors: {
        primary: "#e10098",
        "conf-black": "#0e031c",
        black: "#1b1b1b",

        // #region new design system colors
        "pri-lighter": "var(--color-pri-lighter)",
        "pri-light": "var(--color-pri-light)",
        "pri-base": "var(--color-pri-base)",
        "pri-dark": "var(--color-pri-dark)",
        "pri-darker": "var(--color-pri-darker)",

        "sec-lighter": "var(--color-sec-lighter)",
        "sec-light": "var(--color-sec-light)",
        "sec-base": "var(--color-sec-base)",
        "sec-dark": "var(--color-sec-dark)",
        "sec-darker": "var(--color-sec-darker)",

        // We're using 3-letter color names to avoid conflicting
        // with the old `neutral` color.
        "neu-0": "var(--color-neu-0)",
        "neu-50": "var(--color-neu-50)",
        "neu-100": "var(--color-neu-100)",
        "neu-200": "var(--color-neu-200)",
        "neu-300": "var(--color-neu-300)",
        "neu-400": "var(--color-neu-400)",
        "neu-500": "var(--color-neu-500)",
        "neu-600": "var(--color-neu-600)",
        "neu-700": "var(--color-neu-700)",
        "neu-800": "var(--color-neu-800)",
        "neu-900": "var(--color-neu-900)",
        // #endregion new design system colors
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - .5rem))",
          },
        },
      },
    },
  },
  plugins: [typography],
  darkMode: ["class", 'html[class~="dark"]'],
}
export default config
