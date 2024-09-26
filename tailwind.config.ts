import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          100: "#212A31",
          200: "#2E3944"
        },
        secondary: {
          100: "#124E66",
          200: "#295f75"
        },
        bluegray: "#748D92",
        gray: "#D3D9D4"
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", marginBottom: "-600px" },
          "100%": { opacity: "1", marginBottom: "0" }
        },
        slideDown: {
          "0%": { opacity: "0", marginTop: "-600px" },
          "66%": {opacity: "0.4", marginTop: "-240px"},
          "100%": { opacity: "1", marginTop: "0" }
        }
      },
      animation: {
        slideUp: "slideUp 1s ease-in",
        slideDown: "slideDown 1s ease-in"
      }
    },
  },
  plugins: [],
};
export default config;
