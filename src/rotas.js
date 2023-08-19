const express = require('express');
const roteador = express.Router();
const controladores = require('./controladores/controladores');
const intermediários = require('./intermediarios/intermediarios');

roteador.get('/contas', intermediários.verificarSenhaADM, controladores.consultaContas);
roteador.get('/contas/saldo', intermediários.verificarUsuarioConsulta, intermediários.verificarSenhaUsuarioConsulta, controladores.consultaSaldo);
roteador.get('/contas/extrato', intermediários.verificarUsuarioConsulta, intermediários.verificarSenhaUsuarioConsulta, controladores.consultaExtrato);
roteador.post('/contas', controladores.cadastro);
roteador.post('/transacoes/depositar', intermediários.verificarUsuarioTransacao, controladores.deposito);
roteador.post('/transacoes/sacar', intermediários.verificarUsuarioTransacao, intermediários.verificarSenhaUsuarioTransacao, controladores.saque);
roteador.post('/transacoes/transferir', intermediários.verificarUsuarioTransacao, intermediários.verificarSenhaUsuarioTransacao, controladores.transferencia);
roteador.put('/contas/:numeroConta/usuario', controladores.alterarCadastro);
roteador.delete('/contas/:numeroConta', controladores.deletar);

module.exports = roteador;
