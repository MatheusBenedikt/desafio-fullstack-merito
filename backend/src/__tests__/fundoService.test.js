jest.mock('../repositories/fundoRepository');

const fundoRepository = require('../repositories/fundoRepository');
const fundoService = require('../services/fundoService');

const fundoExemplo = {
  id: 1,
  nome: 'Fundo Renda Fixa',
  ticker: 'RF01',
  tipo: 'Renda Fixa',
  valorCota: 10.5,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('criarFundo', () => {
  it('deve criar um fundo com dados válidos', async () => {
    fundoRepository.buscarPorTicker.mockResolvedValue(null);
    fundoRepository.criarFundo.mockResolvedValue(fundoExemplo);

    const resultado = await fundoService.criarFundo({
      nome: 'Fundo Renda Fixa',
      ticker: 'RF01',
      tipo: 'Renda Fixa',
      valorCota: 10.5,
    });

    expect(resultado).toEqual(fundoExemplo);
    expect(fundoRepository.criarFundo).toHaveBeenCalledTimes(1);
  });

  it('deve rejeitar quando o ticker já existe', async () => {
    fundoRepository.buscarPorTicker.mockResolvedValue(fundoExemplo);

    await expect(
      fundoService.criarFundo({
        nome: 'Outro Fundo',
        ticker: 'RF01',
        tipo: 'Renda Fixa',
        valorCota: 10,
      })
    ).rejects.toThrow(/ticker/i);
  });

  it('deve rejeitar valorCota menor ou igual a zero', async () => {
    fundoRepository.buscarPorTicker.mockResolvedValue(null);

    await expect(
      fundoService.criarFundo({
        nome: 'Fundo Inválido',
        ticker: 'INV01',
        tipo: 'Renda Fixa',
        valorCota: 0,
      })
    ).rejects.toThrow(/valor da cota/i);
  });

  it('deve rejeitar quando campos obrigatórios estão ausentes', async () => {
    await expect(
      fundoService.criarFundo({ nome: 'Só nome' })
    ).rejects.toThrow(/obrigatórios/i);
  });
});

describe('deletarFundo', () => {
  it('deve remover fundo existente', async () => {
    fundoRepository.buscarPorId.mockResolvedValue(fundoExemplo);
    fundoRepository.deletarFundo.mockResolvedValue();

    await expect(fundoService.deletarFundo(1)).resolves.not.toThrow();
    expect(fundoRepository.deletarFundo).toHaveBeenCalledWith(1);
  });

  it('deve lançar erro se o fundo não existir', async () => {
    fundoRepository.buscarPorId.mockResolvedValue(null);

    await expect(fundoService.deletarFundo(99)).rejects.toThrow('Fundo não encontrado');
  });
});