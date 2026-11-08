/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./b/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kings: {
          black: '#0D0D10',
          charcoal: '#16161B',
          card: '#1D1D24',
          cream: '#F6F2E7',
          parchment: '#EAE2CE',
          red: '#D9232E',
          blue: '#1E40AF',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
        },
        // Design B ("Gentleman's Club") palette
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
        serif: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        // Design B: editorial serif + native iPhone system font (SF Pro on iOS)
        editorial: ['"DM Serif Display"', 'Georgia', 'serif'],
        ios: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pole: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '56px 0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
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
        pole: 'pole 2s linear infinite',
        shimmer: 'shimmer 2.8s infinite',
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
