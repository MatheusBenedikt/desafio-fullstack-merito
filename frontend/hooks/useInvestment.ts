import useSWR, { mutate } from 'swr';
import {
  Fundo,
  Movimentacoes,
  Carteira,
  PosicaoFundo,
  CriarFundoDto,
  CriarMovimentacaoDto,
  RespostaApi
} from '@/types/investment';

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  const json: RespostaApi<T> = await res.json();
  if (!json.sucesso) {
    throw new Error(json.error || 'Erro na requisição');
  }
  return json.dados as T;
};

export function useFundos() {
  const { data, error, isLoading } = useSWR<Fundo[]>('/api/fundos', fetcher);

  const criarFundo = async (fundoDados: CriarFundoDto) => {
    const res = await fetch('/api/fundos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fundoDados),
    });
    const json: RespostaApi<Fundo> = await res.json();
    if (!json.sucesso) throw new Error(json.error);
    await mutate('/api/fundos');
    return json.dados;
  };

  const atualizarFundo = async (id: string, fundoDados: CriarFundoDto) => {
    const res = await fetch(`/api/fundos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fundoDados),
    });
    const json: RespostaApi<Fundo> = await res.json();
    if (!json.sucesso) throw new Error(json.error);
    await mutate('/api/fundos');
    return json.dados;
  };

  const deletarFundo = async (id: string) => {
    const res = await fetch(`/api/fundos/${id}`, {
      method: 'DELETE',
    });

    if (res.status === 204) {
      await mutate('/api/fundos');
      return;
    }

    const json = await res.json();
    if (!json.sucesso) throw new Error(json.error);
    await mutate('/api/fundos');
  };

  return {
    fundos: data || [],
    isLoading,
    error,
    criarFundo,
    atualizarFundo,
    deletarFundo,
  };
}

export function useMovimentacoes() {
  const { data, error, isLoading } = useSWR<Movimentacoes[]>('/api/movimentacoes', fetcher);

  const criarMovimentacao = async (movimentacaoDados: CriarMovimentacaoDto) => {
    const res = await fetch('/api/movimentacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movimentacaoDados),
    });
    const json: RespostaApi<Movimentacoes> = await res.json();
    if (!json.sucesso) throw new Error(json.error);
    await mutate('/api/movimentacoes');
    await mutate('/api/movimentacoes/carteira');
    return json.dados;
  };

  const deletarMovimentacao = async (id: string) => {
    const res = await fetch(`/api/movimentacoes/${id}`, {
      method: 'DELETE',
    });

    if (res.status === 204) {
      await mutate('/api/movimentacoes');
      await mutate('/api/movimentacoes/carteira');
      return;
    }

    const json = await res.json();
    if (!json.sucesso) throw new Error(json.error);

    await mutate('/api/movimentacoes');
    await mutate('/api/movimentacoes/carteira');
  }

  return {
    movimentacoes: data || [],
    isLoading,
    error,
    criarMovimentacao,
    deletarMovimentacao,
  };
}

interface CarteiraDados {
  carteira: Carteira;
  posicaoPorFundo: PosicaoFundo[];
}

export function useCarteira() {
  const { data, error, isLoading } = useSWR<CarteiraDados>('/api/movimentacoes/carteira', fetcher);

  return {
    carteira: data?.carteira || {
      saldo: 0,
      totalCotas: 0,
      totalInvestido: 0,
      totalResgatado: 0,
    },
    posicoes: data?.posicaoPorFundo || [],
    isLoading,
    error,
  };
}
