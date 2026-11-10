/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        cloud: {
          white: '#ffffff',
          pearl: '#f8fafc',
          soft: '#f1f5f9',
        },
        sunburst: {
          amber: '#f59e0b',
          gold: '#fbbf24',
          yellow: '#fde047',
        }
      },
      animation: {
        'cloud-drift-slow': 'cloudDrift 45s linear infinite',
        'cloud-drift-fast': 'cloudDrift 25s linear infinite',
        'plane-glide': 'planeGlide 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        cloudDrift: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' }
        },
        planeGlide: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 }
        }
      }
    },
  },
  plugins: [],
}