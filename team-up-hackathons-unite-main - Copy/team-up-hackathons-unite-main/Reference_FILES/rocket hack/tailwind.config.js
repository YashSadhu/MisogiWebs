module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#EBEAFD', // Primary 50 (indigo-50)
          100: '#D7D5FB', // Primary 100 (indigo-100)
          200: '#AFAAF7', // Primary 200 (indigo-200)
          300: '#867FF3', // Primary 300 (indigo-300)
          400: '#5E55EF', // Primary 400 (indigo-400)
          500: '#4F46E5', // Primary 500 (indigo-500)
          600: '#4F46E5', // Primary 600 (indigo-600)
          700: '#4338CA', // Primary 700 (indigo-700)
          800: '#17127A', // Primary 800 (indigo-800)
          900: '#0E0B4D', // Primary 900 (indigo-900)
          DEFAULT: '#4F46E5', // Primary default (indigo-600)
        },
        'primary-hover': '#4338CA', // Primary hover (indigo-700)
        'primary-light': '#E0E7FF', // Primary light (indigo-100)
        'background': '#FFFFFF', // Background (white)
        'surface': '#F9FAFB', // Surface (gray-50)
        'border': '#E5E7EB', // Border (gray-200)
        'text-primary': '#111827', // Text primary (gray-900)
        'text-secondary': '#4B5563', // Text secondary (gray-600)
        'text-tertiary': '#9CA3AF', // Text tertiary (gray-400)
        'success': '#10B981', // Success (emerald-500)
        'warning': '#F59E0B', // Warning (amber-500)
        'error': '#F43F5E', // Error (rose-500)
        'info': '#3B82F6', // Info (blue-500)
        'hackathon-tag-bg': '#EDE9FE', // Hackathon tag background (violet-100)
        'hackathon-tag-text': '#5B21B6', // Hackathon tag text (violet-800)
        'team-tag-bg': '#CCFBF1', // Team tag background (teal-100)
        'team-tag-text': '#0F766E', // Team tag text (teal-800)
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}