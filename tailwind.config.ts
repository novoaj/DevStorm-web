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
      },
      colors: {
        primary: {
          100: "#212A31", // orig dark
          200: "#2E3944", // lighter version
          300: "#171d22", // dark main theme
          400: "#1a2227", // 10% lighter than main
        },
        secondary: {
          100: "#124E66", // blue #124E66
          200: "#295f75" // lighter blue #295f75
        },
        bluegray: {
          100: "#5d7175", // #748D92
          200: "#516366", // #687e83
          300: "#465558"  // #516266
        },
        gray: "#D3D9D4",
        grey: {
          100: "#BEC3BF",
          200 :"#A9AEAA"
        },
        outline: "#5f605f",
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
