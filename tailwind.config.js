/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070d',
          900: '#0a0e18',
          800: '#0f1422',
          700: '#161d2e',
          600: '#1e2740',
          500: '#2a3450',
        },
        accent: {
          50: '#eff8ff',
          100: '#d9eeff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#5ab2ff',
          500: '#3a93ff',
          600: '#2b76f0',
          700: '#225fd0',
          800: '#1f4ea8',
          900: '#1d4285',
        },
        cyan: {
          400: '#5fe9f0',
          500: '#2dd4e6',
          600: '#16b6c9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(90, 178, 255, 0.45)',
        'glow-sm': '0 0 20px -6px rgba(90, 178, 255, 0.4)',
        'glow-lg': '0 0 80px -10px rgba(90, 178, 255, 0.35)',
        phone: '0 40px 80px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.06)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-marker': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.4)', opacity: '0.3' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.15' },
          '50%': { transform: 'scale(1.15)', opacity: '0.25' },
        },
        'drift-1': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(40px, -30px)' },
          '66%': { transform: 'translate(-20px, 20px)' },
        },
        'drift-2': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(-30px, 25px)' },
          '66%': { transform: 'translate(25px, -15px)' },
        },
        'drift-3': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, 30px)' },
        },
        'oscillate': {
          '0%, 100%': { transform: 'rotate(-0.8deg)' },
          '50%': { transform: 'rotate(0.8deg)' },
        },
        'live-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'fade-in': 'fade-in 0.7s ease-out forwards',
        'slide-right': 'slide-right 0.8s ease-out forwards',
        'pulse-marker': 'pulse-marker 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 5s ease-in-out infinite',
        'drift-1': 'drift-1 25s ease-in-out infinite',
        'drift-2': 'drift-2 30s ease-in-out infinite',
        'drift-3': 'drift-3 20s ease-in-out infinite',
        'oscillate': 'oscillate 8s ease-in-out infinite',
        'live-dot': 'live-dot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
