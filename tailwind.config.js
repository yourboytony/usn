/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          gold: '#C4B085',
          300: '#4A5568',
          400: '#2D3748',
          500: '#1A202C',
          600: '#171923',
          700: '#0D1117',
          800: '#080B11',
          900: '#030407',
        },
        camo: {
          light: '#8B7355',
          medium: '#6B4423',
          dark: '#544738',
        }
      },
      backgroundImage: {
        'camo-pattern': "url('/camo-pattern.png')",
      },
      fontFamily: {
        'military': ['Industry', 'Roboto Condensed', 'sans-serif'],
        'display': ['Orbitron', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 