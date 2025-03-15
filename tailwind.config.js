const colors = require('tailwindcss/colors');

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
        primary: '#0070f3',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        'airbnb': {
          'primary': '#FF385C',
          'secondary': '#00A699',
          'dark': '#484848',
          'light': '#F7F7F7',
          'gray': {
            100: '#F7F7F7',
            200: '#DDDDDD',
            300: '#717171',
            400: '#484848',
          }
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'airbnb': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'airbnb-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'airbnb': '12px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'modal-in': 'modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'modal-out': 'modal-out 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'modal-in': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          '60%': { opacity: '1', transform: 'translateY(-6px) scale(1.01)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'modal-out': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
        },
      },
    },
  },
  plugins: [
    // 스크롤바 스타일링을 위한 플러그인
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
        },
        '.scrollbar-thumb-gray-300': {
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#d1d5db',
            borderRadius: '3px',
          },
        },
        '.scrollbar-track-gray-100': {
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f3f4f6',
          },
        },
        '.custom-scrollbar': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #f3f4f6',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#d1d5db',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#9ca3af',
            },
          },
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
  // Tailwind CSS와 부트스트랩을 함께 사용하기 위한 설정
  corePlugins: {
    preflight: false,
  },
} 