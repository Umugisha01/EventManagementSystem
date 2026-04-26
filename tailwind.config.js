/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'event-gold': '#D4AF37',
        'event-charcoal': '#121212',
        'event-dark': '#1E1E1E',
        'vip-gold': '#FFD700',
        'regular-green': '#10B981',
        'general-blue': '#3B82F6',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
