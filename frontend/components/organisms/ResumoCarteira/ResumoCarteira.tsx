import { Box } from '@mui/material';
import {
  AccountBalance as BalanceIcon,
  TrendingUp as InvestedIcon,
  TrendingDown as RedeemedIcon,
  Receipt as QuotasIcon,
} from '@mui/icons-material';
import { CartaoEstatistica } from '@/components/molecules/CartaoEstatistica/CartaoEstatistica';
import { Carteira } from '@/types/investment';

interface ResumoCarteiraProps {
  carteira: Carteira;
}

export function ResumoCarteira({ carteira }: ResumoCarteiraProps) {
  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 3,
      '& > *': {
        flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
        minWidth: 200,
      }
    }}>
      <CartaoEstatistica
        title="Saldo da Carteira"
        value={carteira?.saldo}
        icon={<BalanceIcon />}
        color="primary.main"
      />
      <CartaoEstatistica
        title="Total Investido"
        value={carteira?.totalInvestido}
        icon={<InvestedIcon />}
        color="success.main"
      />
      <CartaoEstatistica
        title="Total Resgatado"
        value={carteira?.totalResgatado}
        icon={<RedeemedIcon />}
        color="error.main"
      />
      <CartaoEstatistica
        title="Total de Cotas"
        value={carteira?.totalCotas}
        icon={<QuotasIcon />}
        isCurrency={false}
        color="warning.main"
      />
    </Box>
  );
}
