const pool = require('../database/conexao');

function mapearFundos(row) {
    if (!row) return null;
    return {
        id: row.id,
        nome: row.nome,
        ticker: row.ticker,
        tipo: row.tipo,
        valorCota: parseFloat(row.valor_cota),
        criadoEm: row.criado_em,
    }
}

async function buscarTodosDados(){
    const resultado = await pool.query('SELECT id, nome, ticker, tipo, valor_cota, criado_em FROM fundos ORDER BY nome DESC');
    return resultado.rows.map(mapearFundos);
}

async function buscarPorId(id){
    const resultado = await pool.query('SELECT id, nome, ticker, tipo, valor_cota, criado_em FROM fundos WHERE id = $1', [id]);
    return mapearFundos(resultado.rows[0]);
}

async function buscarPorTicker(ticker){
    const resultado = await pool.query('SELECT id, nome, ticker, tipo, valor_cota, criado_em FROM fundos WHERE ticker = $1', [ticker.toUpperCase()]);
    return mapearFundos(resultado.rows[0]);
}

async function criarFundo({ nome, ticker, tipo, valorCota }){
    const resultado = await pool.query(
        'INSERT INTO fundos (nome, ticker, tipo, valor_cota) VALUES ($1, $2, $3, $4) RETURNING id, nome, ticker, tipo, valor_cota, criado_em',
        [nome, ticker?.toUpperCase(), tipo, valorCota]
    );
    return mapearFundos(resultado.rows[0]);
}

async function atualizarFundo(id, { nome, ticker, tipo, valorCota }){
    const resultado = await pool.query(
        'UPDATE fundos SET nome = $1, ticker = $2, tipo = $3, valor_cota = $4 WHERE id = $5 RETURNING id, nome, ticker, tipo, valor_cota, criado_em',
        [nome, ticker?.toUpperCase(), tipo, valorCota, id]
    );
    return mapearFundos(resultado.rows[0]);
}

async function deletarFundo(id){
    const resultado = await pool.query(
        'DELETE FROM fundos WHERE id = $1 RETURNING id',
        [id]
    );

    return resultado.rowCount > 0;
}

module.exports = {
    buscarTodosDados,
    buscarPorId,
    buscarPorTicker,
    criarFundo,
    atualizarFundo,
    deletarFundo
}