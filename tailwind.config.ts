import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          md: '34px',
          xl: '2rem',
        },
      },
      colors: {
        bg: '#040404',
        white: '#EFEDE8',
        accent: '#E6533C',
        lightAccent: '#EF8964',
        extraLightAccent: '#EFA082',
      },
    },
  },
  plugins: [],
};
export default config;
