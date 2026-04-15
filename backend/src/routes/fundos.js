const { Router } = require('express');
const fundoController = require('../controllers/fundoController');

const router = Router();

router.get('/', fundoController.listarFundos);

router.get('/:id', fundoController.obterFundoPorId);

router.post('/', fundoController.criarFundo);

router.put('/:id', fundoController.atualizarFundo);

router.delete('/:id', fundoController.deletarFundo);

module.exports = router;