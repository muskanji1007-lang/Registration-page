/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgCream: '#F6F3EB',
        cardBg: '#FCFAF6',
        accentRed: '#FF2E51',
        accentPink: '#EC4899',
        accentYellow: '#FBBF24',
        terminalDark: '#0D1117',
        borderBlack: '#000000',
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #000000',
        'neo': '4px 4px 0px #000000',
        'neo-md': '5px 5px 0px #000000',
        'neo-lg': '6px 6px 0px #000000',
        'neo-xl': '8px 8px 0px #000000',
        'neo-red': '4px 4px 0px #FF2E51',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'Consolas', 'Menlo', 'monospace'],
        display: ['"Space Grotesk"', '"Chakra Petch"', 'Impact', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
