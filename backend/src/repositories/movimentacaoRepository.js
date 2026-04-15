const pool = require('../database/conexao');

function mapearMovimentacao(row) {
    if (!row) return null;
    return {
        id: row.id,
        fundoId: row.fundo_id,
        tipo: row.tipo,
        valor: parseFloat(row.valor),
        data: row.data,
        cotaNoMomento: parseFloat(row.cota_no_momento),
        quantidadeCotas: parseFloat(row.quantidade_cotas),
        criadoEm: row.criado_em,
        fundoNome: row.fundo_nome,
        fundoTicker: row.fundo_ticker,
    }
}

async function buscarTodosDados(){
    const resultado = await pool.query(
        `SELECT m.id, m.fundo_id, m.tipo, m.valor, m.data, m.cota_no_momento, m.quantidade_cotas, m.criado_em,
                f.nome AS fundo_nome, f.ticker AS fundo_ticker
         FROM movimentacoes m
         LEFT JOIN fundos f ON m.fundo_id = f.id
         ORDER BY m.data DESC`
    )
    return resultado.rows.map(mapearMovimentacao);
}

async function buscarPorId(id){
    const resultado = await pool.query(
        `SELECT m.id, m.fundo_id, m.tipo, m.valor, m.data, m.cota_no_momento, m.quantidade_cotas, m.criado_em,
                f.nome AS fundo_nome, f.ticker AS fundo_ticker
         FROM movimentacoes m
         LEFT JOIN fundos f ON m.fundo_id = f.id
         WHERE m.id = $1`, [id]
    );
    return mapearMovimentacao(resultado.rows[0]);
}

async function buscarPorFundo(fundoId){
    const resultado = await pool.query(
        `SELECT id, fundo_id, tipo, valor, data, cota_no_momento, quantidade_cotas, criado_em FROM movimentacoes WHERE fundo_id = $1 ORDER BY data DESC`, [fundoId]
    );
    return resultado.rows.map(mapearMovimentacao);
}

async function buscarTodosDadosSemJoin(){
    const resultado = await pool.query('SELECT id, fundo_id, tipo, valor, data, cota_no_momento, quantidade_cotas, criado_em FROM movimentacoes ORDER BY data DESC');
    return resultado.rows.map(mapearMovimentacao);
}

async function criarMovimentacao({ fundoId, tipo, valor, data, cotaNoMomento, quantidadeCotas }){
    const resultado = await pool.query(
        `INSERT INTO movimentacoes (fundo_id, tipo, valor, data, cota_no_momento, quantidade_cotas)
            VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, fundo_id, tipo, valor, data, cota_no_momento, quantidade_cotas, criado_em`,
        [fundoId, tipo, valor, data || new Date(), cotaNoMomento, quantidadeCotas]
    );
    return mapearMovimentacao(resultado.rows[0]);
}

async function deletarMovimentacao(id){
    const resultado = await pool.query(
        'DELETE FROM movimentacoes WHERE id = $1 RETURNING id',
        [id]
    );
    return resultado.rowCount > 0;
}

module.exports = {
    buscarTodosDados,
    buscarPorId,
    buscarPorFundo,
    buscarTodosDadosSemJoin,
    criarMovimentacao,
    deletarMovimentacao
}