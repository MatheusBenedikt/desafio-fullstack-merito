'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f8efc',
      light: '#6ba5fe',
      dark: '#1e5bb0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: '#ffffff',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#0a0a0a',
      paper: '#141414',
    },
    text: {
      primary: '#ececec',
      secondary: '#b0b0b0',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Geist", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#ffffff',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#ffffff',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#ffffff',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#ffffff',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: '#141414',
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#1d1d1d',
            color: '#ffffff',
          },
        },
      },
    },
  },
});
