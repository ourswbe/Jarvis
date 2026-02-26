import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        'orb-breathe': 'breathe 4s ease-in-out infinite',
        'orb-pulse': 'pulse 1.2s ease-in-out infinite',
        'orb-pulse-fast': 'pulseFast 0.7s ease-in-out infinite',
        'orb-think': 'think 3s linear infinite'
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.06)', opacity: '1' }
        },
        pulseFast: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' }
        },
        think: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.04)' },
          '100%': { transform: 'rotate(360deg) scale(1)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
