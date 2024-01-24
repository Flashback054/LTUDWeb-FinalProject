const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,hbs}"],
  plugins: [require("@tailwindcss/forms")],
  theme: {
    extend: {
      colors: {
        primary: colors.green[600],
      },
    },
  },
};
