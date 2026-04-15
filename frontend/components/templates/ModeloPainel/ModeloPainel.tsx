import { ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as FundsIcon,
  LineAxis as LineAxisIcon,
  Receipt as MovementsIcon,
} from '@mui/icons-material';

interface ModeloPainelProps {
  children: ReactNode;
  tabAtiva: number;
  onTabChange: (tab: number) => void;
}

export function ModeloPainel({
  children,
  tabAtiva,
  onTabChange,
}: ModeloPainelProps) {
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <LineAxisIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Dashboard de Investimentos
          </Typography>
        </Toolbar>
        <Tabs
          value={tabAtiva}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
            '& .Mui-selected': { color: 'white' },
            '& .MuiTabs-indicator': { bgcolor: 'white' },
          }}
        >
          <Tab icon={<DashboardIcon />} iconPosition="start" label="Painel" />
          <Tab icon={<FundsIcon />} iconPosition="start" label="Fundos" />
          <Tab icon={<MovementsIcon />} iconPosition="start" label="Movimentações" />
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
