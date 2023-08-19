const {banco, contas} = require('../bancodedados');

function verificarSenhaADM(req, res, next) {
  const senhaInformada = req.query.senha_banco;

  if (!senhaInformada || senhaInformada !== banco.senha) {
    return res.status(401).json({
      mensagem: "Senha incorreta ou não fornecida."
    });
  };
  next();
};

function verificarSenhaUsuarioTransacao(req, res, next){
  const requisicao = req.body;
  const senha = requisicao.senha;
  let usuario = contas.find((user) => user.numero === requisicao.numero_conta);

  if (!usuario){
    usuario = contas.find((user) => user.numero === requisicao.numero_conta_origem);
  };
  if (senha !== usuario.usuario.senha || !usuario){
      return res.status(401).json({
          mensagem: "conta e/ou senha incorretos"
      });
  };
  next();
};

function verificarUsuarioTransacao(req, res, next){
  const requisicao = req.body;
  let usuario = contas.find((user) => user.numero === requisicao.numero_conta);

  if (!usuario){
    usuario = contas.find((user) => user.numero === requisicao.numero_conta_origem);
  };
  if (!usuario){
      return res.status(404).json({
          mensagem: "Conta não encontrada ou inválida"
      });
  };
  next();
};

function verificarSenhaUsuarioConsulta(req, res, next) {
  const senhaInformada = req.query.senha;
  const usuario = contas.find((usuario) => usuario.numero === req.query.numero_conta);

  if (!senhaInformada || senhaInformada !== usuario.usuario.senha) {
    return res.status(401).json({
      mensagem: "Senha incorreta ou não fornecida."
    });
  };
  next();
};

function verificarUsuarioConsulta(req, res, next) {
  const numero_conta = req.query.numero_conta;
  let usuario = contas.find((user) => user.numero === numero_conta);

  if (!usuario){
      return res.status(404).json({
          mensagem: "Conta não encontrada ou inválida"
      });
  };
  next();
};

module.exports = {
  verificarSenhaADM, 
  verificarSenhaUsuarioTransacao, 
  verificarUsuarioTransacao, 
  verificarSenhaUsuarioConsulta, 
  verificarUsuarioConsulta
};
