export const theme = {
  colors: {
    primary: {
      navy: '#2C3E50',
      slate: '#4A6B8A',
      slateHover: '#5A7BA0',
      slateActive: '#3A5B7A',
    },
    secondary: {
      white: '#FFFFFF',
      lightGray: '#F5F5F5',
      borderGray: '#E0E0E0',
      textPrimary: '#333333',
      textSecondary: '#666666',
      iconGray: '#757575',
    },
    accent: {
      starYellow: '#FFC107',
      successGreen: '#4CAF50',
      errorRed: '#F44336',
      lightBlue: '#E3F2FD',
      hoverGray: '#F0F4F8',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '24px',
      '2xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.08)',
    md: '0 2px 8px rgba(0,0,0,0.12)',
    lg: '0 4px 16px rgba(0,0,0,0.16)',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
  zIndex: {
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modal: 400,
    popover: 500,
    tooltip: 600,
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },
} as const;

export type Theme = typeof theme;

// Made with Bob
