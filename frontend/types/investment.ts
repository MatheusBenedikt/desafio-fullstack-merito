export interface Fundo {
  id: string;
  nome: string;
  ticker: string;
  tipo: FundType;
  valorCota: number;
  criadoEm: string;
}

export type FundType =
  | 'ACAO'
  | 'FII'
  | 'RENDA_FIXA'
  | 'MULTIMERCADO'
  | 'CAMBIAL'
  | 'ETF';

export const FUNDO_TYPES: { value: FundType; label: string }[] = [
  { value: 'ACAO', label: 'Ações' },
  { value: 'FII', label: 'Fundo Imobiliário' },
  { value: 'RENDA_FIXA', label: 'Renda Fixa' },
  { value: 'MULTIMERCADO', label: 'Multimercado' },
  { value: 'CAMBIAL', label: 'Cambial' },
  { value: 'ETF', label: 'ETF' },
];

export interface Movimentacoes {
  id: string;
  fundoId: string;
  data: string;
  valor: number;
  tipo: MovimentacaoType;
  quantidadeCotas: number;
  cotaNoMomento: number;
  criadoEm: string;
  fundoNome: string
  fundoTicker: string
}

export type MovimentacaoType = 'APORTE' | 'RESGATE';

export const MOVIMENTACAO_TYPES: { value: MovimentacaoType; label: string }[] = [
  { value: 'APORTE', label: 'Aporte' },
  { value: 'RESGATE', label: 'Resgate' },
];

export interface Carteira {
  saldo: number;
  totalCotas: number;
  totalInvestido: number;
  totalResgatado: number;
}

export interface PosicaoFundo {
  fundoId: number;
  nome: string;
  ticker: string;
  tipo: FundType;
  valorCota: number;
  valorTotal: number;
  quantidadeCotas: number;
}

export interface CriarFundoDto {
  nome: string;
  ticker: string;
  tipo: FundType;
  valorCota: number;
}

export interface CriarMovimentacaoDto {
  fundoId: string;
  data: string;
  valor: number;
  tipo: MovimentacaoType;
  quantidadeCotas: number;
}

export interface RespostaApi<T> {
  dados?: T;
  error?: string;
  sucesso: boolean;
}
