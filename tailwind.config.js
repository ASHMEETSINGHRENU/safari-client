/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: '#EADCC6',
          light: '#F5EEE2',
          dark: '#DAC4A7',
          warm: '#F1E6D4',
        },
        forest: {
          DEFAULT: '#2E3A23',
          deep: '#1E2717',
          light: '#3F4F30',
          muted: '#4A5B3A',
        },
        earth: {
          DEFAULT: '#8B5E34',
          light: '#A77444',
          dark: '#6F4926',
        },
        gold: {
          DEFAULT: '#D4A35B',
          light: '#E5BF82',
          dark: '#B8873E',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-safari': '0.2em',
      }
    },
  },
  plugins: [],
}
