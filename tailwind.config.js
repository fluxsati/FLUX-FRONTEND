/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Consistent Type Scale
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1' }],
        '6xl': ['60px', { lineHeight: '1' }],
        '7xl': ['72px', { lineHeight: '1' }],
        '8xl': ['96px', { lineHeight: '1' }],
        '9xl': ['128px', { lineHeight: '1' }],
      },
      // Improved Color System
      colors: {
        'flux-cyan': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee', // Dark mode primary - AA compliant
          500: '#06b6d4',
          600: '#0891b2', // Light mode primary - better contrast
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        'flux-text': {
          light: '#0f172a', // Slate-900
          dark: '#f8fafc',  // Slate-50
        },
        'flux-muted': {
          light: '#64748b', // Slate-500
          dark: '#94a3b8',  // Slate-400
        }
      },
      // Consistent Spacing Scale
      spacing: {
        'section': 'clamp(3rem, 8vw, 8rem)',
        'container': 'clamp(1rem, 5vw, 3rem)',
        'card': 'clamp(1rem, 3vw, 2rem)',
      },
      // Consistent Border Radius
      borderRadius: {
        'flux': '1.5rem',
        'flux-lg': '2rem',
        'flux-xl': '2.5rem',
      },
      // Box Shadow System
      boxShadow: {
        'flux': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'flux-md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'flux-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'flux-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'flux-cyan-lg': '0 0 30px rgba(6, 182, 212, 0.4)',
      },
      // Minimum Touch Targets
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
    },
  },
  plugins: [],
}