import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    background: {
      default: '#121212'
    },
    mode: 'dark'
  },
  typography: {
    fontSize: 16
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      a {
          color: white;
        }
      `
    }
  }
});
