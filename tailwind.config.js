const { blackA, green, grass, mauve } = require('@radix-ui/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...green,
        ...grass,
        ...mauve,

        bg_site: "#111113",
        bg_box: "#0F1C1C",
        text_bright: "#A2F0EF",
        text_normal: "#EEEEF0",
        text_dull: "#B2B3BD",
        accent: "#076969",
        border: "#46484F",
      },
    },
  },
  plugins: [],
}