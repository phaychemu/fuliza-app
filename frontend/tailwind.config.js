/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          heading: '#1B4332',
          body: '#2D3A2E',
          label: '#4A5E4B',
          emerald: '#1A7A4A',
          sage: '#6B8F71',
          light: '#E8F5E9',
          border: '#C8E6C9',
        }
      }
    },
  },
  plugins: [],
}
