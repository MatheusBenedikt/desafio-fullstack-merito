import { Card, CardContent, Typography, Box } from '@mui/material';
import { TextoMoeda } from '@/components/atoms/TextoMoeda/TextoMoeda';
import { ReactNode } from 'react';

interface CartaoEstatisticaProps {
  title: string;
  value: number;
  icon: ReactNode;
  isCurrency?: boolean;
  subtitle?: string;
  color?: string;
}

export function CartaoEstatistica({
  title,
  value,
  icon,
  isCurrency = true,
  subtitle,
  color = 'primary.main',
}: CartaoEstatisticaProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {isCurrency ? (
              <TextoMoeda value={value} variant="h5" />
            ) : (
              <Typography variant="h5" fontWeight={600}>
                {value?.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
