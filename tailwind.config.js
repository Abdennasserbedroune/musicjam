/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        neon: {
          pink: '#ff006e',
          purple: '#8338ec',
          blue: '#3a86ff',
          cyan: '#00f5ff',
          green: '#06ffa5',
          yellow: '#ffbe0b',
        },
        dark: {
          900: '#0a0a0f',
          800: '#13131a',
          700: '#1c1c26',
          600: '#25252f',
          500: '#2e2e3a',
        },
      },
      boxShadow: {
        neon: '0 0 5px theme("colors.neon.cyan"), 0 0 20px theme("colors.neon.cyan")',
        'neon-pink':
          '0 0 5px theme("colors.neon.pink"), 0 0 20px theme("colors.neon.pink")',
        'neon-purple':
          '0 0 5px theme("colors.neon.purple"), 0 0 20px theme("colors.neon.purple")',
      },
    },
  },
  plugins: [],
};
