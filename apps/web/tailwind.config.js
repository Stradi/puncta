/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#e6fffe",
          "light-hover": "#d9fffd",
          "light-active": "#b0fffa",
          normal: "#00fff0",
          "normal-hover": "#00e6d8",
          "normal-active": "#00ccc0",
          dark: "#00bfb4",
          "dark-hover": "#009990",
          "dark-active": "#00736c",
          darker: "#005954",
        },
      },
      fontFamily: {
        sans: ["GeneralSans-Variable", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
