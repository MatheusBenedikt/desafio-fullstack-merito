import { Chip } from '@mui/material';
import { MovimentacaoType } from '@/types/investment';

interface ChipStatusProps {
  type: MovimentacaoType;
}

export function ChipStatus({ type }: ChipStatusProps) {
  const isAporte = type === 'APORTE';

  return (
    <Chip
      label={isAporte ? 'Aporte' : 'Resgate'}
      color={isAporte ? 'success' : 'error'}
      size="small"
      sx={{
        fontWeight: 600,
        minWidth: 80,
      }}
    />
  );
}
