const movimentacaoRepository = require('../repositories/movimentacaoRepository');
const fundoRepository = require('../repositories/fundoRepository');

function calcularCotasPorFundo(movimentacao, fundoId) {
   return movimentacao
   .filter((m) => m.fundoId === fundoId)
   .reduce((total, m) => {
        return m.tipo === 'APORTE' 
        ? total + m.quantidadeCotas 
        : total - m.quantidadeCotas;
    }, 0);
}

async function calcularPosicaoPorFundo(movimentacoes, fundos) {
    const listaFundos = Object.fromEntries(fundos.map((f) => [f.id, f]));

    const fundoIds = [...new Set(movimentacoes.map((m) => m.fundoId))];

    return fundoIds.map((fundoId) => {
        const fundo = listaFundos[fundoId];
        if (!fundo) return null;

        const quantidadeCotas = calcularCotasPorFundo(movimentacoes, fundoId);
        const valorTotal = quantidadeCotas * fundo.valorCota;

        return {
            fundoId,
            nome: fundo.nome,
            ticker: fundo.ticker,
            tipo: fundo.tipo,
            valorCota: fundo.valorCota,
            quantidadeCotas: parseFloat(quantidadeCotas.toFixed(6)),
            valorTotal: parseFloat(valorTotal.toFixed(2)),
        }
    })
    .filter(Boolean)
    .filter((f) => f.quantidadeCotas > 0);
}

async function calculaResumoCarteira(movimentacoes) {
    let totalAportado = 0;
    let totalResgatado = 0;

    for (const m of movimentacoes) {
        if (m.tipo === 'APORTE') {
            totalAportado += m.valor;
        } else {
            totalResgatado += m.valor;
        }
    }

    return {
        saldo: parseFloat((totalAportado - totalResgatado).toFixed(2)),
        totalInvestido: parseFloat(totalAportado.toFixed(2)),
        totalResgatado: parseFloat(totalResgatado.toFixed(2)),
        totalCotas: parseFloat(movimentacoes.reduce((total, m) => {
            return m.tipo === 'APORTE'
            ? total + m.quantidadeCotas
            : total - m.quantidadeCotas;
        }, 0).toFixed(6))
    }
}

async function listarMovimentacoes(){
    return await movimentacaoRepository.buscarTodosDados();
}

async function criarMovimentacao({ fundoId, tipo, valor, data }){
    if (!fundoId || !tipo || valor == null || !data) {
        throw new Error('Todos os campos são obrigatórios');
    }

    if (!['APORTE', 'RESGATE'].includes(tipo)) {
        throw new Error('Tipo de movimentação inválido. Deve ser "APORTE" ou "RESGATE"');
    }

    if (Number(valor) <= 0) {
        throw new Error('Valor deve ser maior que zero');
    }

    const fundo = await fundoRepository.buscarPorId(fundoId);
    if (!fundo) {
        throw new Error('Fundo não encontrado');
    }

    const cotaNoMomento = fundo.valorCota;
    
    let quantidadeCotas = Number((valor / cotaNoMomento).toFixed(8));

    if (tipo === 'RESGATE') {
        const movimentacoes = await movimentacaoRepository.buscarPorFundo(fundoId);
        const disponivel = calcularCotasPorFundo(movimentacoes, fundoId);
        
        if (quantidadeCotas > disponivel) {
            if (quantidadeCotas - disponivel > 0.01) { 
                throw new Error(`Saldo insuficiente: a quantidade de cotas para resgate (${quantidadeCotas}) é maior do que as cotas disponíveis (${disponivel})`);            }
            quantidadeCotas = disponivel;
        }
    }

    return await movimentacaoRepository.criarMovimentacao({ fundoId, tipo, valor, data, cotaNoMomento, quantidadeCotas });
}

async function deletarMovimentacao(id){
    const movimentacao = await movimentacaoRepository.buscarPorId(id);
    if (!movimentacao) {
        throw new Error('Movimentação não encontrada');
    }

    const todasMovimentacoes = await movimentacaoRepository.buscarTodosDadosSemJoin();
    const movimentacoesRestantes = todasMovimentacoes.filter((m) => m.id !== Number(id));

    const fundoIds = [...new Set(movimentacoesRestantes.map((m) => m.fundoId))];

    for (const fundoId of fundoIds) {
        const cotasDisponiveis = calcularCotasPorFundo(movimentacoesRestantes, fundoId);
        if (cotasDisponiveis < 0) {
            throw new Error(`Operação inválida: exclusão gera saldo inconsistente`);
        }
    }

    await movimentacaoRepository.deletarMovimentacao(id);
}

async function obterResumoCarteira() {
    const [movimentacoes, fundos] = await Promise.all([
        movimentacaoRepository.buscarTodosDadosSemJoin(),
        fundoRepository.buscarTodosDados()
    ]);

    const carteira = await calculaResumoCarteira(movimentacoes);
    const posicaoPorFundo = await calcularPosicaoPorFundo(movimentacoes, fundos);

    return {
        carteira,
        posicaoPorFundo
    };
}

module.exports = {
    listarMovimentacoes,
    criarMovimentacao,
    deletarMovimentacao,
    obterResumoCarteira
}