import { createTheme } from '@mui/material/styles';
import { palette } from './pallete';
import { typography } from './typography';
import { components } from './components';

export const lightTheme = createTheme({
  palette: {
    ...palette,
    mode: 'light',
  },
  typography,
  shape: {
    borderRadius: 8,
  },
  components,
});

export const darkTheme = createTheme({
  palette: {
    ...palette,
    mode: 'dark',
    background: {
      default: '#05070a',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography,
  shape: {
    borderRadius: 8,
  },
  components,
});