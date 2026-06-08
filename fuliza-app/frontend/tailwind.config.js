/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fuliza: {
          green: '#4CAF50',
          lightgreen: '#E8F5E9',
          teal: '#00897B',
          accent: '#43A047',
          border: '#C8E6C9',
          text: '#2E7D32',
          subtext: '#66BB6A',
        }
      }
    },
  },
  plugins: [],
}
