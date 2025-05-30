/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6FFEC',
          100: '#C1FFCF',
          200: '#9AFFB2',
          300: '#70FF94',
          400: '#47FF76',
          500: '#1DFF58',
          600: '#00F046',
          700: '#00C438',
          800: '#00982B',
          900: '#006D1E',
        },
        dark: {
          50: '#C1C1C1',
          100: '#A3A3A3',
          200: '#858585',
          300: '#666666',
          400: '#484848',
          500: '#2A2A2A',
          600: '#1F1F1F',
          700: '#171717',
          800: '#121212',
          900: '#0A0A0A',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};