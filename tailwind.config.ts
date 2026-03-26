import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sage: "#87a96b",
        cream: "#f5f5dc",
        terracotta: "#e2725b",
        forest: "#243020",
        bark: "#5e5249"
      },
      boxShadow: {
        card: "0 18px 45px rgba(36, 48, 32, 0.12)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 1px 1px, rgba(135, 169, 107, 0.14) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;
