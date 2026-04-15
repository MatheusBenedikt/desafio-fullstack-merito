import { Box, IconButton, Tooltip, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { ChipStatus } from '@/components/atoms/ChipStatus/ChipStatus';
import { TextoMoeda } from '@/components/atoms/TextoMoeda/TextoMoeda';
import { Movimentacoes, Fundo, MovimentacaoType } from '@/types/investment';
import { ptBR } from '@mui/x-data-grid/locales';

interface TabelaMovimentacoesProps {
  movimentacoes: Movimentacoes[];
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function TabelaMovimentacoes({
  movimentacoes,
  onDelete,
  loading = false
}: TabelaMovimentacoesProps) {

  const columns: GridColDef[] = [
    {
      field: 'data',
      headerName: 'Data',
      flex: 1,
      minWidth: 120,
      valueFormatter: (value: string) => {
        if (!value) return '';
        const [ano, mes, dia] = value.split('T')[0].split('-');
        return `${dia}/${mes}/${ano}`;
      },
    },
    {
      field: 'fundId',
      headerName: 'Fundo',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" fontWeight={600}>
              {params.row.fundoTicker || '-'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.fundoNome || '-'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams<Movimentacoes, MovimentacaoType>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <ChipStatus type={params.value as MovimentacaoType} />
        </Box>
      ),
    },
    {
      field: 'valor',
      headerName: 'Valor',
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<Movimentacoes, number>) => {
        const row = params.row as Movimentacoes;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <TextoMoeda
              value={params.value as number}
              positive={row.tipo === 'APORTE'}
              showSign
            />
          </Box>
        );
      },
    },
    {
      field: 'quantidadeCotas',
      headerName: 'Cotas',
      flex: 1,
      minWidth: 100,
      valueFormatter: (value: number) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(4)}`;
      },
    },
    {
      field: 'cotaNoMomento',
      headerName: 'Cota momento compra',
      flex: 1,
      minWidth: 100,
      valueFormatter: (value: number) => {
        return `+${value.toFixed(2)}`;
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Tooltip title="Excluir movimentação">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = movimentacoes.map((m) => ({
    ...m,
    quotas: m.tipo === 'APORTE' ? m.quantidadeCotas : -m.quantidadeCotas,
    valor: m.tipo === 'APORTE' ? m.valor : -m.valor,
  }));

  return (
    <Paper sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
        }}
        disableRowSelectionOnClick
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      />
    </Paper>
  );
}
