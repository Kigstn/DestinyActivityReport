const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                /** https://www.radix-ui.com/colors/custom -> accent: 008080 | gray: 8B8D98 | background: 111111 */
                bg_site: "#0A1313",
                bg_box: "#19191B",
                text_bright: "#A2F0EF",
                text_normal: "#EEEEF0",
                text_dull: "#B2B3BD",
                accent: "#008080",
            },

            text_shadow: {
                sm: '0 1px 2px var(--tw-shadow-color)',
                DEFAULT: '0 2px 4px var(--tw-shadow-color)',
                lg: '0 8px 16px var(--tw-shadow-color)',
            },
        },
    },
    plugins: [
        plugin(function ({matchUtilities, theme}) {
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value,
                    }),
                },
                {values: theme('text_shadow')}
            )
        }),
    ],
}