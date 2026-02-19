/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['NanumBarunpen-Regular'],
        heading: ['NanumBarunpen-Bold'],
      },
      colors: {
        background: '#F5F5F5',
        surface: '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',
        'border-custom': '#E5E7EB',
        'btn-primary': '#1A1A1A',
        'btn-text': '#FFFFFF',
        'progress-bar': '#1A1A1A',
        'progress-track': '#E5E7EB',
        'accent-green': '#5ED99A',
        'accent-red': '#F78C8C',
        'accent-blue': '#7AB5FC',
        'accent-orange': '#FCAB58',
        'accent-purple': '#C99CFC',
      },
    },
  },
  plugins: [],
};
