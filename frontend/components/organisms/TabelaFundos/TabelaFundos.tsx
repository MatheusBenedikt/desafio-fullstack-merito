import { Box, IconButton, Tooltip, Paper, Chip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { TextoMoeda } from '@/components/atoms/TextoMoeda/TextoMoeda';
import { Fundo, FUNDO_TYPES, FundType } from '@/types/investment';
import { ptBR } from '@mui/x-data-grid/locales';

interface TabelaFundosProps {
  fundos: Fundo[];
  onEdit: (fundo: Fundo) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function TabelaFundos({
  fundos,
  onEdit,
  onDelete,
  loading = false
}: TabelaFundosProps) {
  const getFundTypeLabel = (type: FundType) => {
    return FUNDO_TYPES.find(t => t.value === type)?.label || type;
  };


  const getFundTypeColor = (type: FundType): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    const colorMap: Record<FundType, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      ACAO: 'primary',
      FII: 'success',
      RENDA_FIXA: 'info',
      MULTIMERCADO: 'warning',
      CAMBIAL: 'secondary',
      ETF: 'error',
    };
    return colorMap[type] || 'primary';
  };

  const columns: GridColDef[] = [
    {
      field: 'ticker',
      headerName: 'Código',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight={700}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<Fundo, FundType>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip
            label={getFundTypeLabel(params.value as FundType)}
            color={getFundTypeColor(params.value as FundType)}
            size="small"
          />
        </Box>
      ),
    },
    {
      field: 'valorCota',
      headerName: 'Valor da Cota',
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<Fundo, number>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <TextoMoeda value={params.value as number} />
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0.5 }}>
          <Tooltip title="Editar fundo">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(params.row as Fundo)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir fundo">
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

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={fundos}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
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
