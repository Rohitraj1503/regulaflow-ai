/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#08090B',
          secondary: '#111215',
          surface: 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255, 255, 255, 0.18)',
          borderSubtle: 'rgba(255, 255, 255, 0.09)',
        },
        glass: {
          surface: 'rgba(255, 255, 255, 0.06)',
          surfaceHover: 'rgba(255, 255, 255, 0.10)',
          card: 'rgba(17, 18, 21, 0.68)',
          cardHover: 'rgba(28, 30, 36, 0.75)',
          border: 'rgba(255, 255, 255, 0.18)',
          borderSubtle: 'rgba(255, 255, 255, 0.09)',
          borderHover: 'rgba(255, 255, 255, 0.30)',
        },
        lime: {
          accent: '#B9F56B',
          hover: '#A5EA54',
          glow: 'rgba(185, 245, 107, 0.25)',
          dim: 'rgba(185, 245, 107, 0.12)',
        },
        silver: {
          accent: '#C8CBD2',
          muted: '#8A8D96',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A5A5AD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 12px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-highlight': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.22)',
        'lime-glow': '0 0 20px rgba(185, 245, 107, 0.35)',
      }
    },
  },
  plugins: [],
}
