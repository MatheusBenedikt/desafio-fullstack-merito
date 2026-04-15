const request = require('supertest');
const app = require('../app');
const pool = require('../database/conexao');
const { criarTabelas } = require('../database/migrar');

beforeAll(async () => {
  await criarTabelas();
});

afterEach(async () => {
  await pool.query('DELETE FROM movimentacoes');
  await pool.query('DELETE FROM fundos');
});

afterAll(async () => {
  await pool.end();
});

async function criarFundoNaApi(dados = {}) {
  const payload = {
    nome: 'Fundo Teste',
    ticker: 'TST01',
    tipo: 'Renda Fixa',
    valorCota: 10,
    ...dados,
  };
  const res = await request(app).post('/api/fundos').send(payload);
  return res.body.dados;
}

async function criarMovimentacaoNaApi(fundoId, dados = {}) {
  const payload = {
    fundoId,
    tipo: 'APORTE',
    valor: 100,
    data: '2024-01-15',
    ...dados,
  };
  const res = await request(app).post('/api/movimentacoes').send(payload);
  return res.body.dados;
}

describe('GET /api/fundos', () => {
  it('retorna lista vazia quando não há fundos', async () => {
    const res = await request(app).get('/api/fundos');

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toEqual([]);
  });

  it('retorna os fundos cadastrados', async () => {
    await criarFundoNaApi();

    const res = await request(app).get('/api/fundos');

    expect(res.status).toBe(200);
    expect(res.body.dados).toHaveLength(1);
    expect(res.body.dados[0].ticker).toBe('TST01');
  });
});

describe('POST /api/fundos', () => {
  it('cria um fundo com dados válidos', async () => {
    const res = await request(app).post('/api/fundos').send({
      nome: 'Fundo Renda Fixa',
      ticker: 'RF01',
      tipo: 'Renda Fixa',
      valorCota: 10.5,
    });

    expect(res.status).toBe(201);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.ticker).toBe('RF01');
    expect(res.body.dados.valorCota).toBe(10.5);
  });

  it('rejeita ticker duplicado', async () => {
    await criarFundoNaApi({ ticker: 'DUP01' });

    const res = await request(app).post('/api/fundos').send({
      nome: 'Outro Fundo',
      ticker: 'DUP01',
      tipo: 'Renda Fixa',
      valorCota: 10,
    });

    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
    expect(res.body.error).toMatch(/ticker/i);
  });

  it('rejeita valorCota igual a zero', async () => {
    const res = await request(app).post('/api/fundos').send({
      nome: 'Fundo Inválido',
      ticker: 'INV01',
      tipo: 'Renda Fixa',
      valorCota: 0,
    });

    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  it('rejeita quando campos obrigatórios estão ausentes', async () => {
    const res = await request(app).post('/api/fundos').send({ nome: 'Incompleto' });

    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});

describe('PUT /api/fundos/:id', () => {
  it('atualiza um fundo existente', async () => {
    const fundo = await criarFundoNaApi({ nome: 'Nome Antigo' });

    const res = await request(app).put(`/api/fundos/${fundo.id}`).send({
      nome: 'Nome Novo',
      ticker: 'TST01',
      tipo: 'Renda Fixa',
      valorCota: 20,
    });

    expect(res.status).toBe(200);
    expect(res.body.dados.nome).toBe('Nome Novo');
    expect(res.body.dados.valorCota).toBe(20);
  });

  it('retorna 404 para fundo inexistente', async () => {
    const res = await request(app).put('/api/fundos/99999').send({
      nome: 'X',
      ticker: 'X01',
      tipo: 'Renda Fixa',
      valorCota: 10,
    });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/fundos/:id', () => {
  it('remove um fundo sem movimentações', async () => {
    const fundo = await criarFundoNaApi();

    const res = await request(app).delete(`/api/fundos/${fundo.id}`);

    expect(res.status).toBe(204);
  });

  it('retorna 404 para fundo inexistente', async () => {
    const res = await request(app).delete('/api/fundos/99999');

    expect(res.status).toBe(404);
  });
});

describe('GET /api/movimentacoes', () => {
  it('retorna lista vazia quando não há movimentações', async () => {
    const res = await request(app).get('/api/movimentacoes');

    expect(res.status).toBe(200);
    expect(res.body.dados).toEqual([]);
  });

  it('retorna movimentações ordenadas por data decrescente', async () => {
    const fundo = await criarFundoNaApi();
    await criarMovimentacaoNaApi(fundo.id, { data: '2024-01-10' });
    await criarMovimentacaoNaApi(fundo.id, { data: '2024-03-20' });
    await criarMovimentacaoNaApi(fundo.id, { data: '2024-02-05' });

    const res = await request(app).get('/api/movimentacoes');

    expect(res.status).toBe(200);
    expect(res.body.dados).toHaveLength(3);

    const datas = res.body.dados.map((m) => m.data);
    expect(datas[0] >= datas[1]).toBe(true);
    expect(datas[1] >= datas[2]).toBe(true);
  });
});

describe('POST /api/movimentacoes', () => {
  it('cria um aporte e calcula quantidadeCotas corretamente', async () => {
    const fundo = await criarFundoNaApi({ valorCota: 10 });

    const res = await request(app).post('/api/movimentacoes').send({
      fundoId: fundo.id,
      tipo: 'APORTE',
      valor: 100,
      data: '2024-01-15',
    });

    expect(res.status).toBe(201);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.quantidadeCotas).toBe(10);
    expect(res.body.dados.cotaNoMomento).toBe(10);
  });

  it('cria um resgate quando há cotas suficientes', async () => {
    const fundo = await criarFundoNaApi({ valorCota: 10 });
    await criarMovimentacaoNaApi(fundo.id, { valor: 200 });

    const res = await request(app).post('/api/movimentacoes').send({
      fundoId: fundo.id,
      tipo: 'RESGATE',
      valor: 100,
      data: '2024-02-01',
    });

    expect(res.status).toBe(201);
    expect(res.body.sucesso).toBe(true);
  });

  it('rejeita resgate com cotas insuficientes', async () => {
    const fundo = await criarFundoNaApi({ valorCota: 10 });
    await criarMovimentacaoNaApi(fundo.id, { valor: 50 });

    const res = await request(app).post('/api/movimentacoes').send({
      fundoId: fundo.id,
      tipo: 'RESGATE',
      valor: 200,
      data: '2024-02-01',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/insuficiente/i);
  });

  it('rejeita quando o fundo não existe', async () => {
    const res = await request(app).post('/api/movimentacoes').send({
      fundoId: 99999,
      tipo: 'APORTE',
      valor: 100,
      data: '2024-01-15',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/fundo/i);
  });

  it('rejeita valor igual a zero', async () => {
    const fundo = await criarFundoNaApi();

    const res = await request(app).post('/api/movimentacoes').send({
      fundoId: fundo.id,
      tipo: 'APORTE',
      valor: 0,
      data: '2024-01-15',
    });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/movimentacoes/:id', () => {
  it('remove uma movimentação que não gera inconsistência', async () => {
    const fundo = await criarFundoNaApi();
    const mov = await criarMovimentacaoNaApi(fundo.id, { valor: 100 });

    const res = await request(app).delete(`/api/movimentacoes/${mov.id}`);

    expect(res.status).toBe(204);
  });

  it('bloqueia exclusão que geraria saldo negativo', async () => {
    const fundo = await criarFundoNaApi({ valorCota: 10 });

    const aporte = await criarMovimentacaoNaApi(fundo.id, { tipo: 'APORTE', valor: 100 });
    await criarMovimentacaoNaApi(fundo.id, { tipo: 'RESGATE', valor: 100 });

    const res = await request(app).delete(`/api/movimentacoes/${aporte.id}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/inconsistente/i);
  });

  it('retorna 404 para movimentação inexistente', async () => {
    const res = await request(app).delete('/api/movimentacoes/99999');

    expect(res.status).toBe(404);
  });
});

describe('GET /api/movimentacoes/carteira', () => {
  it('retorna carteira zerada quando não há movimentações', async () => {
    const res = await request(app).get('/api/movimentacoes/carteira');

    expect(res.status).toBe(200);
    expect(res.body.dados.carteira.saldo).toBe(0);
    expect(res.body.dados.carteira.totalInvestido).toBe(0);
    expect(res.body.dados.posicaoPorFundo).toEqual([]);
  });

  it('calcula saldo corretamente após aportes e resgates', async () => {
    const fundo = await criarFundoNaApi({ valorCota: 10 });

    await criarMovimentacaoNaApi(fundo.id, { tipo: 'APORTE', valor: 300 });
    await criarMovimentacaoNaApi(fundo.id, { tipo: 'RESGATE', valor: 100 });

    const res = await request(app).get('/api/movimentacoes/carteira');

    expect(res.status).toBe(200);
    expect(res.body.dados.carteira.saldo).toBe(200);
    expect(res.body.dados.carteira.totalInvestido).toBe(300);
    expect(res.body.dados.carteira.totalResgatado).toBe(100);
  });

  it('retorna posições por fundo com quantidadeCotas correta', async () => {
    const fundo = await criarFundoNaApi({ valorCota: 10 });

    await criarMovimentacaoNaApi(fundo.id, { tipo: 'APORTE', valor: 200 });
    await criarMovimentacaoNaApi(fundo.id, { tipo: 'RESGATE', valor: 50 });

    const res = await request(app).get('/api/movimentacoes/carteira');
    const posicao = res.body.dados.posicaoPorFundo[0];

    expect(posicao.quantidadeCotas).toBe(15);
    expect(posicao.valorTotal).toBe(150);
  });
});