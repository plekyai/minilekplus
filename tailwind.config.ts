import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006a60',
          container: '#3ecdbb',
          'fixed-dim': '#57dbc9',
        },
        secondary: {
          DEFAULT: '#795900',
          container: '#ffdea4',
        },
        surface: {
          DEFAULT: '#fbf9f8',
          bright: '#fbf9f8',
          'container-lowest': '#ffffff',
          'container-low': '#f5f3f2',
          container: '#efe9e8',
          'container-high': '#e9e3e2',
        },
        'on-surface': '#1b1c1c',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#261900',
        'inverse-surface': '#2f3030',
        'inverse-on-surface': '#f2f0ef',
        'inverse-primary': '#3ecdbb',
        'outline-variant': '#bec9c7',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        ambient: '0 20px 40px rgba(27, 28, 28, 0.06)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #006a60, #3ecdbb)',
      },
    },
  },
  plugins: [],
}

export default config
