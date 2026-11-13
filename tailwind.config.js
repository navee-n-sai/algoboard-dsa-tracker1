/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        surface: {
          950: '#0a0a0c',
          900: '#101014',
          850: '#14141a',
          800: '#1a1a22',
          700: '#232330',
          600: '#2e2e3d',
        },
        line: {
          DEFAULT: '#232330',
          bright: '#2e2e3d',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          soft: 'rgba(59, 130, 246, 0.12)',
        },
        mint: '#34d399',
        amber2: '#fbbf24',
        rose2: '#fb7185',
        violet2: '#a78bfa',
        cyan2: '#22d3ee',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
        'scale-in': 'scale-in 0.18s ease-out both',
        'slide-in-right': 'slide-in-right 0.25s ease-out both',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
        elevated: '0 12px 40px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
