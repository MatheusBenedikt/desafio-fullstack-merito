import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TabelaFundos } from '@/components/organisms/TabelaFundos/TabelaFundos';
import { FormularioFundo } from '@/components/organisms/FormularioFundo/FormularioFundo';
import { DialogoConfirmacao } from '@/components/molecules/DialogoConfirmacao/DialogoConfirmacao';
import { Fundo, CriarFundoDto } from '@/types/investment';

interface AbaFundosProps {
  fundos: Fundo[];
  onCreateFund: (data: CriarFundoDto) => Promise<void>;
  onUpdateFund: (id: string, data: CriarFundoDto) => Promise<void>;
  onDeleteFund: (id: string) => Promise<void>;
  loading?: boolean;
}

export function AbaFundos({
  fundos,
  onCreateFund,
  onUpdateFund,
  onDeleteFund,
  loading
}: AbaFundosProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingFund, setEditingFund] = useState<Fundo | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (fundo: Fundo) => {
    setEditingFund(fundo);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingFund(undefined);
  };

  const handleSubmit = async (data: CriarFundoDto) => {
    if (editingFund) {
      await onUpdateFund(editingFund.id, data);
    } else {
      await onCreateFund(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDeleteFund(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={600}>
          Fundos Cadastrados
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Novo Fundo
        </Button>
      </Box>

      <TabelaFundos
        fundos={fundos}
        onEdit={handleEdit}
        onDelete={(id: string) => setDeleteId(id)}
        loading={loading}
      />

      <FormularioFundo
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        fundo={editingFund}
      />

      <DialogoConfirmacao
        open={!!deleteId}
        title="Excluir Fundo"
        message="Tem certeza que deseja excluir este fundo? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        isDestructive
      />
    </Box>
  );
}
