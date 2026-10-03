'use client';

import { createTheme, ThemeOptions, Shadows } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

const getPalette = (mode: PaletteMode) => ({
  primary: {
    main: '#2563EB',
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },
  ...(mode === 'light'
    ? {
        mode: 'light' as const,
        background: {
          default: '#F8FAFC',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
        },
        divider: '#E2E8F0',
      }
    : {
        mode: 'dark' as const,
        background: {
          default: '#0F172A',
          paper: '#1E293B',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
        },
        divider: '#334155',
      }),
});

const typography: ThemeOptions['typography'] = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
  ].join(', '),
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
  },
  h2: {
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.3,
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.3,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  subtitle2: {
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  button: {
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.875rem',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
  overline: {
    fontSize: '0.625rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
};

const components: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 16,
        padding: '8px 20px',
        fontWeight: 600,
        transition: 'all 0.2s ease-in-out',
      },
      containedPrimary: {
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
        },
      },
      outlined: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
        },
      },
    },
  },
  MuiCard: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: 16,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
      rounded: {
        borderRadius: 16,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'medium',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(37, 99, 235, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-outlined': {
          fontWeight: 500,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: '14px 16px',
        borderColor: 'divider',
      },
      head: {
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        color: 'text.secondary',
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-root': {
          backgroundColor: 'background.paper',
          borderBottom: '2px solid',
          borderColor: 'divider',
        },
      },
    },
  },
  MuiChip: {
    defaultProps: {
      variant: 'filled',
    },
    styleOverrides: {
      root: {
        fontWeight: 500,
        borderRadius: 8,
        fontSize: '0.75rem',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 20,
        padding: '8px',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        marginBottom: 2,
        padding: '10px 16px',
        transition: 'all 0.15s ease-in-out',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        textTransform: 'none',
        minHeight: 48,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: '0 1px 0 0',
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      arrow: true,
    },
    styleOverrides: {
      tooltip: {
        borderRadius: 8,
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: '6px 12px',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 100,
        height: 8,
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
  },
};

export function getTheme(mode: PaletteMode) {
  return createTheme({
    palette: getPalette(mode),
    typography,
    shape: {
      borderRadius: 16,
    },
    shadows: [
      'none',
      '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
      '0 2px 4px -1px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.05)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      '0 4px 8px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
      '0 6px 10px -1px rgba(0, 0, 0, 0.06), 0 3px 6px -2px rgba(0, 0, 0, 0.06)',
      '0 8px 12px -1px rgba(0, 0, 0, 0.07), 0 4px 8px -2px rgba(0, 0, 0, 0.07)',
      '0 10px 16px -1px rgba(0, 0, 0, 0.07), 0 5px 10px -3px rgba(0, 0, 0, 0.07)',
      '0 12px 20px -1px rgba(0, 0, 0, 0.08), 0 6px 12px -4px rgba(0, 0, 0, 0.08)',
      '0 14px 24px -1px rgba(0, 0, 0, 0.08), 0 7px 14px -4px rgba(0, 0, 0, 0.08)',
      '0 16px 28px -1px rgba(0, 0, 0, 0.09), 0 8px 16px -5px rgba(0, 0, 0, 0.09)',
      '0 18px 32px -1px rgba(0, 0, 0, 0.09), 0 9px 18px -5px rgba(0, 0, 0, 0.09)',
      '0 20px 36px -1px rgba(0, 0, 0, 0.1), 0 10px 20px -6px rgba(0, 0, 0, 0.1)',
      '0 22px 40px -1px rgba(0, 0, 0, 0.1), 0 11px 22px -6px rgba(0, 0, 0, 0.1)',
      '0 24px 44px -1px rgba(0, 0, 0, 0.11), 0 12px 24px -7px rgba(0, 0, 0, 0.11)',
      '0 26px 48px -1px rgba(0, 0, 0, 0.11), 0 13px 26px -7px rgba(0, 0, 0, 0.11)',
      '0 28px 52px -1px rgba(0, 0, 0, 0.12), 0 14px 28px -8px rgba(0, 0, 0, 0.12)',
      '0 30px 56px -1px rgba(0, 0, 0, 0.12), 0 15px 30px -8px rgba(0, 0, 0, 0.12)',
      '0 32px 60px -1px rgba(0, 0, 0, 0.13), 0 16px 32px -9px rgba(0, 0, 0, 0.13)',
      '0 34px 64px -1px rgba(0, 0, 0, 0.13), 0 17px 34px -9px rgba(0, 0, 0, 0.13)',
      '0 36px 68px -1px rgba(0, 0, 0, 0.14), 0 18px 36px -10px rgba(0, 0, 0, 0.14)',
      '0 38px 72px -1px rgba(0, 0, 0, 0.14), 0 19px 38px -10px rgba(0, 0, 0, 0.14)',
      '0 40px 76px -1px rgba(0, 0, 0, 0.15), 0 20px 40px -11px rgba(0, 0, 0, 0.15)',
      '0 42px 80px -1px rgba(0, 0, 0, 0.15), 0 21px 42px -11px rgba(0, 0, 0, 0.15)',
      '0 44px 84px -1px rgba(0, 0, 0, 0.16), 0 22px 44px -12px rgba(0, 0, 0, 0.16)',
      '0 46px 88px -1px rgba(0, 0, 0, 0.16), 0 23px 46px -12px rgba(0, 0, 0, 0.16)',
    ] as unknown as Shadows,
    components,
  });
}
