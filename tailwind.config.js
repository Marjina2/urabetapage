/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        modalSlide: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-16px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        modalSlide: 'modalSlide 0.2s ease-out forwards'
      }
    },
  },
  plugins: [],
} 