/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: 'var(--void)',
        base: 'var(--base)',
        clay: 'var(--clay)',
        'clay-mid': 'var(--clay-mid)',
        'clay-high': 'var(--clay-high)',
        overlay: 'var(--overlay)',
        
        border: {
          ghost: 'var(--border-ghost)',
          dim: 'var(--border-dim)',
          warm: 'var(--border-warm)',
          hot: 'var(--border-hot)',
          ember: 'var(--border-ember)',
        },
        
        ember: {
          DEFAULT: 'var(--ember)',
          bright: 'var(--ember-bright)',
          pale: 'var(--ember-pale)',
          dim: 'var(--ember-dim)',
          ghost: 'var(--ember-ghost)',
          glow: 'var(--ember-glow)',
        },
        
        amber: {
          DEFAULT: 'var(--amber)',
          dim: 'var(--amber-dim)',
        },
        
        text: {
          hot: 'var(--text-hot)',
          warm: 'var(--text-warm)',
          dim: 'var(--text-dim)',
          ghost: 'var(--text-ghost)',
        },
        
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',

        // Stitch Design System Colors
        "inverse-primary": "#aa3600",
        "on-primary-container": "#511500",
        "tertiary": "#c4c6ce",
        "on-error": "#690005",
        "on-tertiary-fixed-variant": "#43474d",
        "surface-container-high": "#372620",
        "on-secondary": "#2d3136",
        "on-surface-variant": "#c4c6ca",
        "background": "#1e100b",
        "secondary-fixed": "#e0e2ea",
        "surface-container-low": "#281812",
        "surface-container": "#18191b",
        "primary-container": "#ff5708",
        "on-tertiary": "#2d3136",
        "surface-dim": "#1e100b",
        "outline-variant": "#5c4037",
        "inverse-on-surface": "#3e2c26",
        "on-tertiary-container": "#262a30",
        "on-secondary-fixed-variant": "#43474d",
        "primary-fixed": "#ffdbcf",
        "on-secondary-container": "#b2b5bc",
        "secondary-container": "#43474d",
        "on-tertiary-fixed": "#181c21",
        "on-primary-fixed": "#390c00",
        "secondary": "#c4c6ce",
        "tertiary-fixed-dim": "#c4c6ce",
        "secondary-fixed-dim": "#c4c6ce",
        "on-surface": "#e2e2e4",
        "surface": "#111213",
        "on-secondary-fixed": "#181c21",
        "on-primary": "#5c1900",
        "on-background": "#fbdcd3",
        "surface-container-highest": "#43302a",
        "error": "#ffb4ab",
        "surface-container-lowest": "#190b06",
        "surface-tint": "#ffb59c",
        "surface-bright": "#48352e",
        "tertiary-fixed": "#e0e2ea",
        "primary": "#ffb59c",
        "outline": "#ac897e",
        "tertiary-container": "#8e9198",
        "inverse-surface": "#fbdcd3",
        "primary-fixed-dim": "#ffb59c",
        "surface-variant": "#43302a",
        "on-primary-fixed-variant": "#822700",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6"
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        "headline-lg": ["Sora", "sans-serif"],
        "headline-xl": ["Sora", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "headline-lg-mobile": ["Sora", "sans-serif"],
        "body-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["22px", {"lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "headline-xl": ["30px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-lg": ["15px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-caps": ["10px", {"lineHeight": "1.2", "letterSpacing": "0.1em", "fontWeight": "600"}],
        "headline-lg-mobile": ["18px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "body-md": ["13px", {"lineHeight": "1.6", "fontWeight": "400"}]
      },
      spacing: {
        "gutter": "1.5rem",
        "container-padding-mobile": "1.25rem",
        "container-padding-desktop": "2.5rem",
        "base": "8px"
      },
      borderRadius: {
        "DEFAULT": "0.75rem",
        "lg": "1.5rem",
        "xl": "2.5rem",
        "full": "9999px"
      },
      boxShadow: {
        clay: 'inset 4px 4px 10px rgba(255, 255, 255, 0.05), inset -4px -4px 10px rgba(0, 0, 0, 0.5), 0 10px 30px rgba(0, 0, 0, 0.5)',
        'clay-hover': 'inset 2px 2px 5px rgba(255, 255, 255, 0.08), inset -2px -2px 5px rgba(0, 0, 0, 0.6), 0 15px 35px rgba(255, 85, 0, 0.1)',
        'clay-active': 'inset 6px 6px 12px rgba(0, 0, 0, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.05)',
        'clay-glow': '0 0 20px rgba(255, 85, 0, 0.3)',
        'neon-border': '0 0 10px rgba(255, 85, 0, 0.5), inset 0 0 10px rgba(255, 85, 0, 0.2)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
