/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        b: {
          ink: '#0B0A09',
          surface: '#151312',
          raised: '#1E1B19',
          line: 'rgba(243,237,224,0.09)',
          oxblood: '#5E161B',
          red: '#B3262F',
          brass: '#C9A45C',
          brassLight: '#E3C98F',
          cream: '#F3EDE0',
          muted: '#A39C90',
          navy: '#1C2A4A',
        },
      },
      fontFamily: {
        editorial: ['"DM Serif Display"', 'Georgia', 'serif'],
        ios: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        sheen: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '60%, 100%': { transform: 'translateX(220%) skewX(-20deg)' },
        },
        scanline: {
          '0%': { top: '8%' },
          '50%': { top: '88%' },
          '100%': { top: '8%' },
        },
        sheetUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        sheen: 'sheen 3.6s ease-in-out infinite',
        scanline: 'scanline 2.4s ease-in-out infinite',
        sheetUp: 'sheetUp 0.32s cubic-bezier(0.32,0.72,0,1)',
        fadeIn: 'fadeIn 0.2s ease-out',
        riseIn: 'riseIn 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
