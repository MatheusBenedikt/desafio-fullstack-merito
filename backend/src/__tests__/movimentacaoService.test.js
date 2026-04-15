jest.mock('../repositories/movimentacaoRepository');
jest.mock('../repositories/fundoRepository');

const movimentacaoRepository = require('../repositories/movimentacaoRepository');
const fundoRepository = require('../repositories/fundoRepository');
const movimentacaoService = require('../services/movimentacaoService');

const fundoExemplo = {
  id: 1,
  nome: 'Fundo Imobiliário XPTO',
  ticker: 'XPTO11',
  valorCota: 100.0,
};

const movimentacaoAporte = {
  id: 10,
  fundoId: 1,
  tipo: 'APORTE',
  valor: 500.0,
  quantidadeCotas: 5.0,
  data: '2026-04-14',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('criarMovimentacao', () => {
  it('deve criar um APORTE com sucesso', async () => {
    fundoRepository.buscarPorId.mockResolvedValue(fundoExemplo);
    movimentacaoRepository.criarMovimentacao.mockResolvedValue({
      ...movimentacaoAporte,
      cotaNoMomento: 100.0
    });

    const resultado = await movimentacaoService.criarMovimentacao({
      fundoId: 1,
      tipo: 'APORTE',
      valor: 500.0,
      data: '2026-04-14'
    });

    expect(resultado.quantidadeCotas).toBe(5);
    expect(fundoRepository.buscarPorId).toHaveBeenCalledWith(1);
    expect(movimentacaoRepository.criarMovimentacao).toHaveBeenCalled();
  });

  it('deve rejeitar se o fundo não existir', async () => {
    fundoRepository.buscarPorId.mockResolvedValue(null);

    await expect(
      movimentacaoService.criarMovimentacao({
        fundoId: 99,
        tipo: 'APORTE',
        valor: 100,
        data: '2026-04-14'
      })
    ).rejects.toThrow('Fundo não encontrado');
  });

  it('deve rejeitar RESGATE se não houver cotas suficientes', async () => {
    fundoRepository.buscarPorId.mockResolvedValue(fundoExemplo);
   
    movimentacaoRepository.buscarPorFundo.mockResolvedValue([
      { id: 1, tipo: 'APORTE', quantidadeCotas: 2, fundoId: 1 }
    ]);

    await expect(
      movimentacaoService.criarMovimentacao({
        fundoId: 1,
        tipo: 'RESGATE',
        valor: 300.0,
        data: '2026-04-14'
      })
    ).rejects.toThrow(/maior do que as cotas disponíveis/);
  });

  it('deve aceitar RESGATE se houver cotas suficientes', async () => {
    fundoRepository.buscarPorId.mockResolvedValue(fundoExemplo);
    
    movimentacaoRepository.buscarPorFundo.mockResolvedValue([
      { id: 1, tipo: 'APORTE', quantidadeCotas: 10, fundoId: 1 }
    ]);
    movimentacaoRepository.criarMovimentacao.mockResolvedValue({ id: 11, tipo: 'RESGATE' });

    await expect(
      movimentacaoService.criarMovimentacao({
        fundoId: 1,
        tipo: 'RESGATE',
        valor: 500.0,
        data: '2026-04-14'
      })
    ).resolves.not.toThrow();
  });

  it('deve rejeitar valores menores ou iguais a zero', async () => {
    await expect(
      movimentacaoService.criarMovimentacao({
        fundoId: 1,
        tipo: 'APORTE',
        valor: 0,
        data: '2026-04-14'
      })
    ).rejects.toThrow('Valor deve ser maior que zero');
  });
});

describe('deletarMovimentacao', () => {
  it('deve impedir remoção que gera saldo inconsistente (cotas negativas)', async () => {
    const mov1 = { id: 1, fundoId: 1, tipo: 'APORTE', quantidadeCotas: 10 };
    const mov2 = { id: 2, fundoId: 1, tipo: 'RESGATE', quantidadeCotas: 8 };
    
    movimentacaoRepository.buscarPorId.mockResolvedValue(mov1);
    movimentacaoRepository.buscarTodosDadosSemJoin.mockResolvedValue([mov1, mov2]);

    await expect(movimentacaoService.deletarMovimentacao(1)).rejects.toThrow(
      'Operação inválida: exclusão gera saldo inconsistente'
    );
  });

  it('deve remover com sucesso se o saldo continuar positivo', async () => {
    const mov1 = { id: 1, fundoId: 1, tipo: 'APORTE', quantidadeCotas: 10 };
    
    movimentacaoRepository.buscarPorId.mockResolvedValue(mov1);
    movimentacaoRepository.buscarTodosDadosSemJoin.mockResolvedValue([mov1]);
    movimentacaoRepository.deletarMovimentacao.mockResolvedValue(true);

    await expect(movimentacaoService.deletarMovimentacao(1)).resolves.not.toThrow();
    expect(movimentacaoRepository.deletarMovimentacao).toHaveBeenCalledWith(1);
  });
});