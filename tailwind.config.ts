import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: {
          500: '#06b6d4', // cyan-500
          600: '#0891b2', // cyan-600
          700: '#0e7490', // cyan-700
        },
        purple: {
          500: '#a855f7', // purple-500  
          600: '#9333ea', // purple-600
          700: '#7c3aed', // purple-700
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
