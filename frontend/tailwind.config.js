/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#4f46e5',
            DEFAULT: '#4338ca',
            dark: '#3730a3',
          },
          secondary: {
            light: '#f9fafb',
            DEFAULT: '#f3f4f6',
            dark: '#e5e7eb',
          },
          danger: {
            light: '#ef4444',
            DEFAULT: '#dc2626',
            dark: '#b91c1c',
          },
          success: {
            light: '#22c55e',
            DEFAULT: '#16a34a',
            dark: '#15803d',
          },
          warning: {
            light: '#f59e0b',
            DEFAULT: '#d97706',
            dark: '#b45309',
          },
        },
        boxShadow: {
          card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    plugins: [],
  }