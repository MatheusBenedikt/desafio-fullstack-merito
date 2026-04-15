import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TabelaMovimentacoes } from '@/components/organisms/TabelaMovimentacoes/TabelaMovimentacoes';
import { FormularioMovimentacao } from '@/components/organisms/FormularioMovimentacao/FormularioMovimentacao';
import { DialogoConfirmacao } from '@/components/molecules/DialogoConfirmacao/DialogoConfirmacao';
import { Movimentacoes, Fundo, CriarMovimentacaoDto } from '@/types/investment';

interface AbaMovimentacoesProps {
  movimentacoes: Movimentacoes[];
  fundos: Fundo[];
  onCreateMovement: (data: CriarMovimentacaoDto) => Promise<void>;
  onDeleteMovement: (id: string) => Promise<void>;
  loading?: boolean;
}

export function AbaMovimentacoes({
  movimentacoes,
  fundos,
  onCreateMovement,
  onDeleteMovement,
  loading
}: AbaMovimentacoesProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDeleteMovement(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={600}>
          Movimentações
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          disabled={fundos.length === 0}
        >
          Nova Movimentação
        </Button>
      </Box>

      {fundos.length === 0 && (
        <Typography color="text.secondary">
          Cadastre um fundo antes de registrar movimentações.
        </Typography>
      )}

      <TabelaMovimentacoes
        movimentacoes={movimentacoes}
        onDelete={(id) => setDeleteId(id)}
        loading={loading}
      />

      <FormularioMovimentacao
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={onCreateMovement}
        fundos={fundos}
      />

      <DialogoConfirmacao
        open={!!deleteId}
        title="Excluir Movimentação"
        message="Tem certeza que deseja excluir esta movimentação? O saldo e as cotas serão recalculados."
        confirmText="Excluir"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        isDestructive
      />
    </Box>
  );
}
