import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  InputAdornment,
  Typography,
} from '@mui/material';
import { CampoFormulario } from '@/components/molecules/CampoFormulario/CampoFormulario';
import { Fundo, MOVIMENTACAO_TYPES, CriarMovimentacaoDto, MovimentacaoType } from '@/types/investment';

interface FormularioMovimentacaoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CriarMovimentacaoDto) => Promise<void>;
  fundos: Fundo[];
}

export function FormularioMovimentacao({ open, onClose, onSubmit, fundos }: FormularioMovimentacaoProps) {
  const [formData, setFormData] = useState<CriarMovimentacaoDto>({
    fundoId: '',
    data: new Date().toISOString().split('T')[0],
    valor: 0,
    tipo: 'APORTE',
    quantidadeCotas: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotasPreview, setQuotasPreview] = useState<number>(0);

  const fundoSelecionado = fundos.find(f => f.id === formData.fundoId);

  useEffect(() => {
    if (fundoSelecionado && formData.valor > 0) {
      setQuotasPreview(formData.valor / fundoSelecionado.valorCota);
    } else {
      setQuotasPreview(0);
    }
  }, [formData.valor, formData.fundoId, fundoSelecionado]);

  const handleChange = (field: keyof CriarMovimentacaoDto) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value: string | number = e.target.value;
    if (field === 'valor') {
      value = parseFloat(e.target.value) || 0;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fundoId || !formData.data || !formData.valor) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar movimentação');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fundoId: '',
      data: new Date().toISOString().split('T')[0],
      valor: 0,
      tipo: 'APORTE',
      quantidadeCotas: 0
    });
    setError(null);
    onClose();
  };

  const fundOptions = fundos.map(f => ({
    value: f.id,
    label: `${f.ticker} - ${f.nome}`,
  }));

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nova Movimentação</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <CampoFormulario
              label="Fundo"
              value={formData.fundoId}
              onChange={handleChange('fundoId')}
              options={fundOptions}
              required
            />

            <CampoFormulario
              label="Tipo de Movimentação"
              value={formData.tipo}
              onChange={handleChange('tipo')}
              options={MOVIMENTACAO_TYPES}
              required
            />

            <CampoFormulario
              label="Data"
              type="date"
              value={formData.data}
              onChange={handleChange('data')}
              required
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
            />

            <CampoFormulario
              label="Valor"
              type="number"
              value={formData.valor || ''}
              onChange={handleChange('valor')}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              inputProps={{
                step: '0.01',
                min: '0'
              }}
            />

            {quotasPreview > 0 && fundoSelecionado && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: formData.tipo === 'APORTE' ? 'success.light' : 'error.light',
                  borderRadius: 1,
                  color: 'white',
                }}
              >
                <Typography variant="body2">
                  {formData.tipo === 'APORTE' ? 'Você irá comprar' : 'Você irá vender'}:
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {quotasPreview.toFixed(4)} cotas de {fundoSelecionado.ticker}
                </Typography>
                <Typography variant="caption">
                  Valor da cota: R$ {fundoSelecionado.valorCota.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            color={formData.tipo === 'APORTE' ? 'success' : 'error'}
          >
            {loading ? 'Salvando...' : formData.tipo === 'APORTE' ? 'Realizar Aporte' : 'Realizar Resgate'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
