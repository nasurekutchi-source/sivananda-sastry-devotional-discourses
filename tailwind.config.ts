import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#f5f1e8',
          200: '#e8dcc8',
          300: '#d4a574',
          400: '#c49464',
          500: '#8b6f47',
          600: '#6b5534',
          700: '#3a2f2a',
          800: '#2a1f1a',
          900: '#1a1410',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        heading: ['var(--font-cinzel)', 'serif'],
        body: ['var(--font-crimson-pro)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
