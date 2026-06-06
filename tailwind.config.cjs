/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#1C0340',   // main dark purple
        secondary: '#7135F2', // secondary purple
        tertiary: '#9163F2',  // lighter purple
        accent: '#05C7F2',    // teal accent
        neutral: '#F2F2F2',   // background neutral
      },
      boxShadow: {
        card: '0 8px 24px rgba(28,3,64,0.08)',
      },
      borderRadius: {
        DEFAULT: '0.75rem', // 12px
        lg: '1rem', // 16px
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};