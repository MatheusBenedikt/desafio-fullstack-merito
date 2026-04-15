const { Router } = require('express');
const movimentacaoController = require('../controllers/movimentacaoController');

const router = Router();

router.get('/', movimentacaoController.listarMovimentacoes);

router.post('/', movimentacaoController.criarMovimentacao);

router.get('/carteira', movimentacaoController.obterResumoCarteira);

router.delete('/:id', movimentacaoController.deletarMovimentacao);


module.exports = router;