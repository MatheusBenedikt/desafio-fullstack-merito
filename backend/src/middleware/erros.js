function tratadorDeErros(err, req, res, next) {
  console.error('[Erro não tratado]', err);
  res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
}
 
module.exports = tratadorDeErros;