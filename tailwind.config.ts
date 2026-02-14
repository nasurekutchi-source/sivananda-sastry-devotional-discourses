import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#faf8f5',
          secondary: '#f5f2ed',
          tertiary: '#ffffff',
        },
        accent: {
          primary: '#8b5a3c',
          secondary: '#c17d4f',
          light: '#e5d4c1',
          hover: '#a06b4a',
        },
        text: {
          primary: '#2c2520',
          secondary: '#5a4f47',
          tertiary: '#8b7d6f',
        },
        border: {
          light: '#e8e3dc',
          medium: '#d4cec3',
        },
      },
      fontFamily: {
        heading: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-lato)', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(44, 37, 32, 0.08)',
        card: '0 4px 16px rgba(44, 37, 32, 0.12)',
        elevated: '0 8px 24px rgba(44, 37, 32, 0.16)',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
