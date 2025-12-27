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
        tsok: {
          blue: '#1e3a8a',
          red: '#dc2626',
          yellow: '#fbbf24',
          green: '#16a34a',
        },
      },
    },
  },
  plugins: [],
}
