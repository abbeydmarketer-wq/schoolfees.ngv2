/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--p))',
        secondary: 'hsl(var(--s))',
        accent: 'hsl(var(--a))',
        'primary-content': 'hsl(var(--pc))',
        'secondary-content': 'hsl(var(--sc))',
        'accent-content': 'hsl(var(--ac))',
      }
    },
  },
  plugins: [],
}