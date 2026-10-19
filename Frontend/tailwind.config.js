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
        // Modern Indian Road-Safety Palette
        saarthi: {
          navy: '#101B3F',
          'navy-dark': '#0B122B',
          'royal-blue': '#3867FF',
          'royal-hover': '#2554EE',
          violet: '#7655F7',
          saffron: '#FF9F43',
          coral: '#FF665A',
          sky: '#EAF2FF',
          'sky-dark': '#18254F',
          offwhite: '#FAFAF7',
          'offwhite-dark': '#0E1733',
        },
        // Linear-inspired UI Tokens
        linear: {
          bg: {
            light: '#FAFAF7',
            dark: '#0C1329',
          },
          surface: {
            light: '#FFFFFF',
            dark: '#141E3E',
            elevated: '#F2F6FE',
            'elevated-dark': '#1B2750',
          },
          border: {
            light: '#E2E8F0',
            dark: '#253568',
          },
          text: {
            light: '#101B3F',
            dark: '#F1F5F9',
            muted: '#5B6B8E',
            'muted-dark': '#94A3B8',
          },
          accent: {
            DEFAULT: '#3867FF',
            hover: '#2655EE',
            violet: '#7655F7',
            saffron: '#FF9F43',
            coral: '#FF665A',
            soft: '#EAF2FF',
            'soft-dark': '#192652',
          }
        },
        // Purposeful Indian Traffic Sign colors
        sign: {
          red: {
            DEFAULT: '#FF4757',
            soft: '#FEE2E2',
            dark: '#7F1D1D',
          },
          amber: {
            DEFAULT: '#FF9F43',
            soft: '#FEF3C7',
            dark: '#78350F',
          },
          blue: {
            DEFAULT: '#3867FF',
            soft: '#EAF2FF',
            dark: '#1E3A8A',
          },
          green: {
            DEFAULT: '#10B981',
            soft: '#D1FAE5',
            dark: '#064E3B',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'subtle': '6px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 27, 63, 0.06)',
        'elevated': '0 4px 16px -2px rgba(16, 27, 63, 0.08), 0 2px 6px -2px rgba(16, 27, 63, 0.04)',
        'glow': '0 0 24px -4px rgba(56, 103, 255, 0.25)',
      }
    },
  },
  plugins: [],
}
