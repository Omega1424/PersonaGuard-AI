/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // PersonaGuard AI color palette
        'pg-darkest': '#0d0521',
        'pg-dark': '#120b2e',
        'pg-mid': '#1e0a4c',
        'pg-border': '#3d1f7a',
        'pg-accent': '#7c3aed',
        // Legacy custom colors
        background: '#0d0521',
        'user-bubble': '#9333ea', // purple-600
        'bot-bubble': '#1e0a4c',
        text: '#f3e8ff', // purple-100
      },
      fontFamily: {
        'sans': ['system-ui', 'sans-serif'],
      },
      maxWidth: {
        'chat': '800px',
      }
    },
  },
  plugins: [],
}
