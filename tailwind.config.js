const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
