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
        background: {
          DEFAULT: '#F5F5F5',
          dark: '#111111',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1C1C1E',
        },
        'text-primary': {
          DEFAULT: '#1A1A1A',
          dark: '#F5F5F5',
        },
        'text-secondary': {
          DEFAULT: '#6B7280',
          dark: '#9CA3AF',
        },
        'text-muted': {
          DEFAULT: '#9CA3AF',
          dark: '#6B7280',
        },
        'border-custom': {
          DEFAULT: '#E5E7EB',
          dark: '#2C2C2E',
        },
        'btn-primary': {
          DEFAULT: '#1A1A1A',
          dark: '#F5F5F5',
        },
        'btn-text': {
          DEFAULT: '#FFFFFF',
          dark: '#1A1A1A',
        },
        'progress-bar': {
          DEFAULT: '#1A1A1A',
          dark: '#F5F5F5',
        },
        'progress-track': {
          DEFAULT: '#E5E7EB',
          dark: '#2C2C2E',
        },
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
