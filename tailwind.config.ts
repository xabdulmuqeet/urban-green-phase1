import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sage: "#8da184",
        cream: "#eef1ea",
        terracotta: "#516448",
        forest: "#2d3d28",
        bark: "#65705f"
      },
      boxShadow: {
        card: "0 24px 50px rgba(62, 79, 55, 0.08)"
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
