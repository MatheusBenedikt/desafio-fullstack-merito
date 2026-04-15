const pool = require('./conexao');

async function criarTabelas() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS fundos (
        id          SERIAL PRIMARY KEY,
        nome        VARCHAR(255) NOT NULL,
        ticker      VARCHAR(20)  NOT NULL UNIQUE,
        tipo        VARCHAR(100) NOT NULL,
        valor_cota  NUMERIC(18, 6) NOT NULL CHECK (valor_cota > 0),
        criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS movimentacoes (
        id                 SERIAL PRIMARY KEY,
        fundo_id           INTEGER NOT NULL REFERENCES fundos(id) ON DELETE RESTRICT,
        tipo               VARCHAR(10) NOT NULL CHECK (tipo IN ('APORTE', 'RESGATE')),
        valor              NUMERIC(18, 2) NOT NULL CHECK (valor > 0),
        data               DATE NOT NULL,
        cota_no_momento    NUMERIC(18, 6) NOT NULL,
        quantidade_cotas   NUMERIC(18, 6) NOT NULL,
        criado_em          TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Tabelas criadas com sucesso.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar tabelas:', err);
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  criarTabelas().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { criarTabelas };