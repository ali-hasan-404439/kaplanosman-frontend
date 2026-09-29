import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f1f1f',
        secondary: '#696969',
        accent: '#7c3bed',
        background: '#ffffff',
        'background-secondary': '#f7f9fb',
        foreground: '#111827',
        'text-secondary': '#64748b',
      },
      container: {
        screens: {
          DEFAULT: '1352px',
        },
        center: true,
        padding: '1.2rem',
      },
      screens: {
        xs: '540px',
      },
    },
  },
  plugins: [],
} satisfies Config;
