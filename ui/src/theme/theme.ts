import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2D2D2D',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2D2D2D',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#2D2D2D',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 4,
  },
};

const theme = createTheme(themeOptions);

export default theme; 




/* 
 This file contains the theme configuration for main components.
 * 
 * Color Palette:
 * - Primary: Green-based colors (#7AB80E)
 * - Secondary: Gray-based colors (#424242)
 * - Background colors for different surfaces
 * - Text colors for primary and secondary text
 * 
 * Typography:
 * - Default font stack: Roboto, Helvetica, Arial, sans-serif
 * - Configured styles for h1, h2 headers
 * - Custom button text styling
 * 
 * Component Customization:
 * 1. Buttons:
 *    - Custom border radius
 *    - Specific padding
 *    - No elevation (shadow)
 * 
 * 2. Cards:
 *    - Rounded corners
 *    - Subtle shadow effect
 * 
 * 3. Text Fields:
 *    - Outlined variant by default
 *    - Custom border radius
 * 
 * Global Shape:
 * - Default border radius: 4px
 * 
 * Usage:
 * We are importing this theme and wrapping our app with ThemeProvider
 * Usage:
 * import theme from './theme';
 * import { ThemeProvider } from '@mui/material/styles';
 * 
 * <ThemeProvider theme={theme}>
 *   <App />
 * </ThemeProvider>
 */
 