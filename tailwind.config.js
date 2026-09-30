/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        arcade: {
          darkest: '#03050c',
          deep: '#070b1a',
          surface: '#0d132b',
          card: '#121a3b',
          border: '#1f2b5c',
          cyan: '#00f5ff',
          neonCyan: '#38bdf8',
          magenta: '#ff007f',
          pink: '#ec4899',
          violet: '#9d4edd',
          purple: '#7928ca',
          amber: '#ffb703',
          gold: '#ffd166',
          emerald: '#06d6a0',
          danger: '#ff3366',
          darkRed: '#450a1b'
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
        tech: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 245, 255, 0.45)',
        'glow-cyan-lg': '0 0 45px rgba(0, 245, 255, 0.65)',
        'glow-magenta': '0 0 25px rgba(255, 0, 127, 0.45)',
        'glow-purple': '0 0 25px rgba(157, 78, 221, 0.45)',
        'glow-gold': '0 0 25px rgba(255, 183, 3, 0.5)',
        'glow-emerald': '0 0 25px rgba(6, 214, 160, 0.5)',
        'glow-danger': '0 0 25px rgba(255, 51, 102, 0.5)',
        'arcade-btn': '0 4px 0 rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.5)',
        'cyber-card': '0 12px 30px -5px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      }
    }
  },
  plugins: [],
}
