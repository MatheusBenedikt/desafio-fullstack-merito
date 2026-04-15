const fundoRepository = require('../repositories/fundoRepository');
const movimentacaoRepository = require('../repositories/movimentacaoRepository');

async function listarFundos(){
    return await fundoRepository.buscarTodosDados();
}

async function obterFundoPorId(id){
    const fundo = await fundoRepository.buscarPorId(id);
    if (!fundo) {
        throw new Error('Fundo não encontrado');
    }
    return fundo;
}

async function criarFundo({ nome, ticker, tipo, valorCota }){
    if (!nome || !ticker || !tipo || valorCota == null) {
        throw new Error('Todos os campos são obrigatórios');
    }

    if (Number(valorCota) <= 0) {
        throw new Error('Valor da cota deve ser maior que zero');
    }

    const fundoExistente = await fundoRepository.buscarPorTicker(ticker);
    if (fundoExistente) {
        throw new Error(`Já existe um fundo com o ticker "${ticker.toUpperCase()}"`);
    }

    return await fundoRepository.criarFundo({ nome, ticker, tipo, valorCota });
}

async function atualizarFundo(id, { nome, ticker, tipo, valorCota }){
    const fundoAtual = await fundoRepository.buscarPorId(id);
    if (!fundoAtual) {
        throw new Error('Fundo não encontrado');
    }

    if (!nome || !ticker || !tipo || valorCota == null) {
        throw new Error('Todos os campos são obrigatórios');
    }

    if (Number(valorCota) <= 0) {
        throw new Error('Valor da cota deve ser maior que zero');
    }

    const outroFundo = await fundoRepository.buscarPorTicker(ticker);
    if (outroFundo && String(outroFundo.id) !== String(id)) {
        throw new Error(`Já existe um fundo com o ticker "${ticker.toUpperCase()}"`);
    }

    return await fundoRepository.atualizarFundo(id, { nome, ticker, tipo, valorCota });
}

async function deletarFundo(id){
    const fundo = await fundoRepository.buscarPorId(id);
    if (!fundo) {
        throw new Error('Fundo não encontrado');
    }

    const movimentacoes = await movimentacaoRepository.buscarPorFundo(id);
    if (movimentacoes && movimentacoes.length > 0) {
        throw new Error('Não é possível excluir um fundo que possui movimentações registradas');
    }

    return fundoRepository.deletarFundo(id);
}

module.exports = {
    listarFundos,
    obterFundoPorId,
    criarFundo,
    atualizarFundo,
    deletarFundo
}