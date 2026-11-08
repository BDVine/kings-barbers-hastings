/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
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
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pole: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '56px 0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        pole: 'pole 2s linear infinite',
        shimmer: 'shimmer 2.8s infinite',
      }
    },
  },
  plugins: [],
}
