import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|card|input|ripple|spinner).js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        dashboardbg: "url('/images/sunhack-background-image.png')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [nextui()],
};
export default config;
