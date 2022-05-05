const express = require('express');
const usuario = require('./Controladores/usuarios');
const categoria = require('./Controladores/categorias');
const transacao = require('./Controladores/transacoes');
const auth = require('./Middleware/middleware');

const rotas = express();

rotas.get('/usuario/:id', auth, usuario.detalharUsuario)
rotas.put('/usuario',auth, usuario.atualizarUsuario);
rotas.post('/usuario', usuario.cadastrarUsuario);
rotas.delete('/usuario', auth, usuario.detalharUsuario);

rotas.post('/login', usuario.login);

rotas.get('/categoria', auth, categoria.listarCategorias);

rotas.get('/transacao', auth, transacao.listarTransacoes);
rotas.post('/transacao', auth, transacao.cadastrarTransacao);
rotas.put('/transacao/:id', auth, transacao.atualizarTransacao);
rotas.delete('/transacao/:id', auth, transacao.deletarTransacao);
rotas.get('/transacao/extrato', auth, transacao.obterExtrato);

module.exports = rotas;