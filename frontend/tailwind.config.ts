import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customOrange: '#ffefd5',    // PapayaWhip
        customYellow: '#fffacd',    // LemonChiffon
        customReddishBrown: '#8b4513', // SaddleBrown
        darkCustomOrange: '#ff8c00', // DarkOrange for dark mode
        darkCustomYellow: '#ffd700', // Gold for dark mode
        darkCustomReddishBrown: '#8b0000', // DarkRed for dark mode
      },
      backgroundImage: {
        'dashboardbg': "url('/images/sunhack-background-image.png')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
export default config;
