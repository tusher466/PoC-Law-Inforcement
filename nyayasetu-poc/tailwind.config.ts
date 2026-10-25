import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f4ef',
          100: '#c2e4d7',
          200: '#99d2bd',
          300: '#6ebd9f',
          400: '#46a983',
          500: '#006A4E', // Bangladesh flag green
          600: '#005f45',
          700: '#004f3a',
          800: '#003e2e',
          900: '#002c21',
        },
        tealAccent: {
          50: '#eef8f9',
          100: '#d4eff1',
          200: '#ace0e4',
          300: '#75cbcf',
          400: '#3eb0b5',
          500: '#0E7C86', // Teal accent
          600: '#0a636c',
          700: '#074c53',
          800: '#05363b',
          900: '#032326',
        },
        alertRed: {
          DEFAULT: '#D32F2F',
          light: '#FFEBEE',
          dark: '#B71C1C',
        },
        warningAmber: {
          DEFAULT: '#F5A524',
          light: '#FFF8E1',
          dark: '#C77700',
        },
        surface: {
          bg: '#F6F8F7',
          card: '#FFFFFF',
          muted: '#F1F5F3',
          border: '#E2E8E5',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans Bengali"', '"Hind Siliguri"', 'Inter', 'system-ui', 'sans-serif'],
        bengali: ['"Noto Sans Bengali"', '"Hind Siliguri"', 'sans-serif'],
        english: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0, 44, 33, 0.05)',
        card: '0 4px 20px -2px rgba(0, 44, 33, 0.07)',
        elevated: '0 10px 30px -4px rgba(0, 44, 33, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
