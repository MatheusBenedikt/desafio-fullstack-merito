import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '@/lib/theme';

interface ProvedorTemaProps {
  children: React.ReactNode;
}

export function ProvedorTema({ children }: ProvedorTemaProps) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
