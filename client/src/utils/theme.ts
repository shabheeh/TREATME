import { createTheme } from "@mui/material/styles";

import '@fontsource/noto-sans/300.css';  
import '@fontsource/noto-sans/400.css';  
import '@fontsource/noto-sans/500.css';  
import '@fontsource/noto-sans/700.css';  

export const theme = createTheme({
    typography: {
      fontFamily: [
        'Noto Sans',
        '-apple-system',
        'BlinkMacSystemFont',
        'Arial',
        'sans-serif'
      ].join(','),
   
      h1: {
        fontSize: '3.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        '@media (max-width:600px)': {
          fontSize: '2.5rem',
        },
      },
      h2: {
        fontSize: '3rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        '@media (max-width:600px)': {
          fontSize: '2rem',
        },
      },
      h3: {
        fontSize: '2.4rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        fontWeight: 400,
      },
      button: {
        fontWeight: 500,
        fontSize: '0.875rem',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff',
          },
        },
      },
    },
    palette: {
      primary: {
        main: '#009C9D',
      },
      secondary: {
        main: '#999999'
      },
    },
  });