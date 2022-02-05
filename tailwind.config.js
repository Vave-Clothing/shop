const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
        primary: colors.indigo,
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
        mono: ['Fira Mono', 'monospace'],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(0%)', opacity: 0 },
          '5%': { transform: 'translateX(50%)', opacity: 0 },
          '10%': { transform: 'translateX(100%)', opacity: 1 },
          '15%': { transform: 'translateX(150%)', opacity: 0 },
          '20%, 100%': { transform: 'translateX(200%)', opacity: 0 },
        }
      },
      animation: {
        shimmer: 'shimmer 4s linear infinite 2s'
      },
      ringWidth: {
        '3': '3px',
      },
      height: {
        '18': '4.5rem',
      },
      width: {
        '18': '4.5rem',
      },
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '1': '1px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
