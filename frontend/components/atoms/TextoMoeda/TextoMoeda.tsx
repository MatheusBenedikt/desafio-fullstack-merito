import { Typography, TypographyProps } from '@mui/material';

interface TextoMoedaProps extends Omit<TypographyProps, 'children'> {
  value: number;
  showSign?: boolean;
  positive?: boolean;
}

export function TextoMoeda({
  value,
  showSign = false,
  positive,
  ...props
}: TextoMoedaProps) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  const displayValue = showSign && value > 0 ? `+${formatted}` : formatted;

  const colorMap = {
    true: 'success.main',
    false: 'error.main',
    undefined: 'text.primary',
  };

  return (
    <Typography
      {...props}
      sx={{
        color: positive !== undefined ? colorMap[String(positive) as keyof typeof colorMap] : undefined,
        fontWeight: 600,
        ...props.sx,
      }}
    >
      {displayValue}
    </Typography>
  );
}
