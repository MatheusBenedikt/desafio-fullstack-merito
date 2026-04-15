const express = require('express');
const cors = require('cors');
require('dotenv').config();
 
const rotasFundos = require('./routes/fundos');
const rotasMovimentacoes = require('./routes/movimentacoes');
const tratadorDeErros = require('./middleware/erros');
 
const app = express();
 
app.use(cors());
app.use(express.json());
 
app.use('/api/fundos', rotasFundos);
app.use('/api/movimentacoes', rotasMovimentacoes);
 
app.get('/health', (req, res) => res.json({ status: 'ok' }));
 
app.use(tratadorDeErros);
 
module.exports = app;