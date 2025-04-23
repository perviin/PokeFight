/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gameboy: {
          darkest: '#0F380F',
          dark: '#306230',
          light: '#8BAC0F',
          lightest: '#9BBC0F',
        },
      },
      fontFamily: {
        gameboy: ['GameBoy', 'monospace'],
      },
    },
  },
  plugins: [],
};