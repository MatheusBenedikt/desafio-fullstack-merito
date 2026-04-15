import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  InputAdornment,
} from '@mui/material';
import { CampoFormulario } from '@/components/molecules/CampoFormulario/CampoFormulario';
import { Fundo, FUNDO_TYPES, CriarFundoDto } from '@/types/investment';

interface FormularioFundoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CriarFundoDto) => Promise<void>;
  fundo?: Fundo;
}

export function FormularioFundo({ open, onClose, onSubmit, fundo }: FormularioFundoProps) {
  const [formData, setFormData] = useState<CriarFundoDto>({
    nome: fundo?.nome || '',
    ticker: fundo?.ticker || '',
    tipo: fundo?.tipo || 'ACAO',
    valorCota: fundo?.valorCota || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fundo) {
      setFormData({
        nome: fundo.nome || '',
        ticker: fundo.ticker || '',
        tipo: fundo.tipo || 'ACAO',
        valorCota: fundo.valorCota || 0,
      });
    } else {
      setFormData({ nome: '', ticker: '', tipo: 'ACAO', valorCota: 0 });
    }
  }, [fundo, open]);

  const handleChange = (field: keyof CriarFundoDto) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'valorCota'
      ? parseFloat(e.target.value) || 0
      : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nome || !formData.ticker || !formData.valorCota) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar fundo');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ nome: '', ticker: '', tipo: 'ACAO', valorCota: 0 });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {fundo ? 'Editar Fundo' : 'Cadastrar Novo Fundo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <CampoFormulario
              label="Nome do Fundo"
              value={formData?.nome}
              onChange={handleChange('nome')}
              required
              placeholder="Ex: Itaú Ações"
            />

            <CampoFormulario
              label="Código (Ticker)"
              value={formData?.ticker}
              onChange={handleChange('ticker')}
              required
              placeholder="Ex: ITUB4"
              inputProps={{
                style: { textTransform: 'uppercase' }
              }}
            />

            <CampoFormulario
              label="Tipo de Fundo"
              value={formData?.tipo}
              onChange={handleChange('tipo')}
              options={FUNDO_TYPES}
              required
            />

            <CampoFormulario
              label="Valor da Cota"
              type="number"
              value={formData?.valorCota || ''}
              onChange={handleChange('valorCota')}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              inputProps={{
                step: '0.01',
                min: '0'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : fundo ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
