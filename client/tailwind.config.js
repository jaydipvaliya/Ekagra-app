/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper:        '#f5f0e8',
        'paper-mid':  '#ede8dd',
        'paper-dark': '#2a2520',
        'paper-deep': '#1e1a16',
        ink:          '#1a1a1a',
        'ink-light':  '#6b6560',
        'ink-faint':  '#c4bfb5',
        'ink-ghost':  '#ddd8ce',
        chalk:        '#f0ebe3',
        'chalk-dim':  '#a09888',
        accent:       '#c0392b',
        'accent-hover':'#a93226',
        'accent-muted':'#d4a574',
        'accent-warm': '#e8c9a0',
        crosshatch:   '#e8e2d8',
        'ruled-line':  '#d5cfc4',
      },
      fontFamily: {
        heading: ['Caveat', 'cursive'],
        body:    ['Architects Daughter', 'cursive'],
      },
      borderRadius: {
        sketch: '2px',
        'sketch-md': '4px',
      },
      boxShadow: {
        'ink': '2px 3px 0px rgba(26, 26, 26, 0.15)',
        'ink-lg': '3px 4px 0px rgba(26, 26, 26, 0.2)',
        'ink-dark': '2px 3px 0px rgba(240, 235, 227, 0.1)',
      },
      animation: {
        'sketch-in': 'sketchIn 0.5s ease-out both',
        'pencil-draw': 'pencilDraw 0.8s ease-out both',
        'scribble': 'scribble 0.3s ease-out both',
        'ink-drop': 'inkDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
      keyframes: {
        sketchIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) rotate(-1deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(0deg)' },
        },
        pencilDraw: {
          '0%': { 'clip-path': 'inset(0 100% 0 0)' },
          '100%': { 'clip-path': 'inset(0 0 0 0)' },
        },
        scribble: {
          '0%': { opacity: '0', transform: 'scale(0.95) rotate(-2deg)' },
          '50%': { transform: 'scale(1.02) rotate(0.5deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        inkDrop: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
