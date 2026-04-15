'use client';

import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { ModeloPainel } from '@/components/templates/ModeloPainel/ModeloPainel';
import { AbaPainel } from '@/components/pages/AbaPainel/AbaPainel';
import { AbaFundos } from '@/components/pages/AbaFundos/AbaFundos';
import { AbaMovimentacoes } from '@/components/pages/AbaMovimentacoes/AbaMovimentacoes';
import { Carregando } from '@/components/atoms/Carregando/Carregando';
import { useFundos, useMovimentacoes, useCarteira } from '@/hooks/useInvestment';
import { CriarFundoDto, CriarMovimentacaoDto } from '@/types/investment';

export default function Home() {
  const [tabAtiva, SetTabAtiva] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const {
    fundos,
    isLoading: fundoLoading,
    criarFundo,
    atualizarFundo,
    deletarFundo
  } = useFundos();

  const {
    movimentacoes,
    isLoading: movimentacaoLoading,
    criarMovimentacao,
    deletarMovimentacao
  } = useMovimentacoes();

  const {
    carteira,
    posicoes,
    isLoading: carteiraLoading
  } = useCarteira();

  const showMessage = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateFund = async (data: CriarFundoDto) => {
    try {
      await criarFundo(data);
      showMessage('Fundo cadastrado com sucesso!', 'success');
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Erro ao cadastrar fundo', 'error');
      throw error;
    }
  };

  const handleUpdateFund = async (id: string, data: CriarFundoDto) => {
    try {
      await atualizarFundo(id, data);
      showMessage('Fundo atualizado com sucesso!', 'success');
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Erro ao atualizar fundo', 'error');
      throw error;
    }
  };

  const handleDeleteFund = async (id: string) => {
    try {
      await deletarFundo(id);
      showMessage('Fundo excluído com sucesso!', 'success');
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Erro ao excluir fundo', 'error');
    }
  };

  const handleCreateMovement = async (data: CriarMovimentacaoDto) => {
    try {
      await criarMovimentacao(data);
      showMessage('Movimentação registrada com sucesso!', 'success');
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Erro ao registrar movimentação', 'error');
      throw error;
    }
  };

  const handleDeleteMovement = async (id: string) => {
    try {
      await deletarMovimentacao(id);
      showMessage('Movimentação excluída com sucesso!', 'success');
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Erro ao excluir movimentação', 'error');
    }
  };

  const isLoading = fundoLoading || movimentacaoLoading || carteiraLoading;

  return (
    <ModeloPainel tabAtiva={tabAtiva} onTabChange={SetTabAtiva}>
      {isLoading ? (
        <Carregando message="Carregando dados..." />
      ) : (
        <>
          {tabAtiva === 0 && (
            <AbaPainel
              carteira={carteira}
              movimentacoes={movimentacoes}
              fundos={fundos}
              posicoes={posicoes}
              onDeleteMovement={handleDeleteMovement}
              loading={movimentacaoLoading}
            />
          )}
          {tabAtiva === 1 && (
            <AbaFundos
              fundos={fundos}
              onCreateFund={handleCreateFund}
              onUpdateFund={handleUpdateFund}
              onDeleteFund={handleDeleteFund}
              loading={fundoLoading}
            />
          )}
          {tabAtiva === 2 && (
            <AbaMovimentacoes
              movimentacoes={movimentacoes}
              fundos={fundos}
              onCreateMovement={handleCreateMovement}
              onDeleteMovement={handleDeleteMovement}
              loading={movimentacaoLoading}
            />
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ModeloPainel>
  );
}
