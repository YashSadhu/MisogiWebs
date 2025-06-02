/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Medical blue (primary) - blue-600
        'primary-50': '#EFF6FF', // Light blue (50-level shade) - blue-50
        'primary-100': '#DBEAFE', // Light blue (100-level shade) - blue-100
        'primary-500': '#3B82F6', // Medium blue (500-level shade) - blue-500
        'primary-600': '#2563EB', // Primary blue (600-level shade) - blue-600
        'primary-700': '#1D4ED8', // Dark blue (700-level shade) - blue-700
        
        // Secondary Colors
        'secondary': '#64748B', // Professional slate gray (secondary) - slate-500
        'secondary-50': '#F8FAFC', // Light slate (50-level shade) - slate-50
        'secondary-100': '#F1F5F9', // Light slate (100-level shade) - slate-100
        'secondary-200': '#E2E8F0', // Light slate (200-level shade) - slate-200
        'secondary-300': '#CBD5E1', // Light slate (300-level shade) - slate-300
        'secondary-400': '#94A3B8', // Medium slate (400-level shade) - slate-400
        'secondary-500': '#64748B', // Secondary slate (500-level shade) - slate-500
        'secondary-600': '#475569', // Dark slate (600-level shade) - slate-600
        'secondary-700': '#334155', // Dark slate (700-level shade) - slate-700
        
        // Accent Colors
        'accent': '#059669', // Success green (accent) - emerald-600
        'accent-50': '#ECFDF5', // Light emerald (50-level shade) - emerald-50
        'accent-100': '#D1FAE5', // Light emerald (100-level shade) - emerald-100
        'accent-500': '#10B981', // Medium emerald (500-level shade) - emerald-500
        'accent-600': '#059669', // Accent emerald (600-level shade) - emerald-600
        
        // Background Colors
        'background': '#FAFBFC', // Soft off-white background - gray-50
        'surface': '#FFFFFF', // Pure white surface - white
        
        // Text Colors
        'text-primary': '#1E293B', // Deep charcoal text - slate-800
        'text-secondary': '#64748B', // Muted gray text - slate-500
        
        // Status Colors
        'success': '#10B981', // Vibrant green success - emerald-500
        'success-50': '#ECFDF5', // Light success (50-level shade) - emerald-50
        'success-100': '#D1FAE5', // Light success (100-level shade) - emerald-100
        'success-500': '#10B981', // Success emerald (500-level shade) - emerald-500
        
        'warning': '#F59E0B', // Warm amber warning - amber-500
        'warning-50': '#FFFBEB', // Light warning (50-level shade) - amber-50
        'warning-100': '#FEF3C7', // Light warning (100-level shade) - amber-100
        'warning-500': '#F59E0B', // Warning amber (500-level shade) - amber-500
        
        'error': '#EF4444', // Clear red error - red-500
        'error-50': '#FEF2F2', // Light error (50-level shade) - red-50
        'error-100': '#FEE2E2', // Light error (100-level shade) - red-100
        'error-500': '#EF4444', // Error red (500-level shade) - red-500
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'focus': '0 0 0 3px rgba(37, 99, 235, 0.1)',
      },
      animation: {
        'pulse-gentle': 'pulse 2s infinite',
        'scale-press': 'scale-press 0.1s ease-out',
      },
      keyframes: {
        'scale-press': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.98)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '900': '900',
        '1000': '1000',
        '1100': '1100',
        '1200': '1200',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}