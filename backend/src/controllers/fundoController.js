const fundoService = require('../services/fundoService');

async function listarFundos(req, res) {
    try {
        const fundos = await fundoService.listarFundos();
        res.json({ sucesso: true, dados: fundos });
    } catch (error) {
        res.status(500).json({ sucesso: false, error: error.message });
    }
}

async function obterFundoPorId(req, res) {
    try {
        const { id } = req.params;
        const fundo = await fundoService.obterFundoPorId(id);
        res.json({ sucesso: true, dados: fundo });
    } catch (error) {
        const status = error.message === 'Fundo não encontrado' ? 404 : 500;
        res.status(status).json({ sucesso: false, error: error.message });
    }
}

async function criarFundo(req, res) {
    try {
        const novoFundo = await fundoService.criarFundo(req.body);
        res.status(201).json({ sucesso: true, dados: novoFundo });
    } catch (error) {
        res.status(400).json({ sucesso: false, error: error.message });
    }
}

async function atualizarFundo(req, res) {
    try {
        const { id } = req.params;
        const fundoAtualizado = await fundoService.atualizarFundo(id, req.body);
        res.json({ sucesso: true, dados: fundoAtualizado });
    }
    catch (error) {
        const status = error.message === 'Fundo não encontrado' ? 404 : 400;
        res.status(status).json({ sucesso: false, error: error.message });
    }
}

async function deletarFundo(req, res) {
    try {
        const { id } = req.params;
        await fundoService.deletarFundo(id);
        res.status(204).json({ sucesso: true, mensagem: 'Fundo deletado com sucesso' });
    } catch (error) {
        res.status(404).json({ sucesso: false, error: error.message });
    }
}

module.exports = {
    listarFundos,
    obterFundoPorId,
    criarFundo,
    atualizarFundo,
    deletarFundo
};