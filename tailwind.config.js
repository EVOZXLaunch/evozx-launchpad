/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premiumBlack: '#0B0E14',
        premiumGold: '#D4AF37',
        premiumBlue: '#2563EB'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(37, 99, 235, 0.3)',
        'neon-gold': '0 0 15px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}
