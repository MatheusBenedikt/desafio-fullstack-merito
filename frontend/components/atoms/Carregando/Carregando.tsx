import { CircularProgress, Box, Typography } from '@mui/material';

interface CarregandoProps {
  message?: string;
  size?: number;
}

export function Carregando({ message = 'Carregando...', size = 40 }: CarregandoProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: 4,
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}
