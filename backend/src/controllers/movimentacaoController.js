const movimentacaoService = require('../services/movimentacaoService');

async function listarMovimentacoes(req, res) {
    try {
        const movimentacao = await movimentacaoService.listarMovimentacoes();
        res.json({ sucesso: true, dados: movimentacao });
    } catch (error) {
        res.status(500).json({ sucesso: false, error: error.message });
    }
}

async function criarMovimentacao(req, res) {
    try {
        const novaMovimentacao = await movimentacaoService.criarMovimentacao(req.body);
        res.status(201).json({ sucesso: true, dados: novaMovimentacao });
    } catch (error) {
        res.status(400).json({ sucesso: false, error: error.message });
    }
}

async function deletarMovimentacao(req, res) {
    try {
        const { id } = req.params;
        await movimentacaoService.deletarMovimentacao(id);
        res.status(204).json({ sucesso: true, mensagem: 'Movimentação deletada com sucesso' });
    } catch (error) {
       const status = error.message === 'Movimentação não encontrada' ? 404 : 400;
       res.status(status).json({ sucesso: false, error: error.message });
    }
}

async function obterResumoCarteira(req, res) {
    try {
        const { carteira, posicaoPorFundo } = await movimentacaoService.obterResumoCarteira();
        
        res.json({ sucesso: true, dados: { carteira, posicaoPorFundo } });
    } catch (error) {
        res.status(500).json({ sucesso: false, error: error.message });
    }
}

module.exports = {
    listarMovimentacoes,
    criarMovimentacao,
    deletarMovimentacao,
    obterResumoCarteira
}