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
