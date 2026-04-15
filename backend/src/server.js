const app = require('./app');
const { criarTabelas } = require('./database/migrar');

const PORTA = process.env.PORT || 3001;

async function iniciar() {
  try {
    await criarTabelas();
    app.listen(PORTA, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    });
  } catch (erro) {
    console.error('Falha ao iniciar o servidor:', erro);
    process.exit(1);
  }
}

iniciar();