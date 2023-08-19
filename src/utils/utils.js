const { contas } = require('../bancodedados');
const validator = require('validator');
const dataRegex = /^(0[1-9]|[1-2]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2})$/;

function verificaCpfEmail(cpf, email, res){
    const consultaUsuario = contas.find((user) => user.usuario.cpf === cpf)
    if (consultaUsuario){
        return res.status(403).json({
            mensagem: "Erro ao cadastrar CPF"
        });
        return true;
    };
    const consultaUsuarioEmail = contas.find((user) => user.usuario.email === email)
    if (consultaUsuarioEmail){
        return res.status(403).json({
            mensagem: "Erro ao cadastrar  email"
        });
        return true;
    };
    return false;
};

function dataAtual(){
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth() + 1;
    const dia = dataAtual.getDate();
    const hora = dataAtual.getHours();
    const minutos = dataAtual.getMinutes();
    const segundos = dataAtual.getSeconds();
    return `${ano}-${mes}-${dia} ${hora}:${minutos}:${segundos}`
};

function validadorNumeroDeConta(numero, res){
    if (!/^[0-9]+$/.test(numero)){
        return res.status(400).json({
            mensagem: "Número da conta inválido"
        });
        return true;
    };
    return false;
};

function validadorNome(nome, res){
    if ( typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({
            mensagem: "Por favor preencha corretamente o campo nome\nEx: nome sobrenome."
        });
        return true;
    };
    return false;
}

function validadorCpf(cpf, res){
    if ( cpf.length !== 11|| cpf.trim() === "" || !/^[0-9]+$/.test(cpf)) {
        return res.status(400).json({
            mensagem: "Por favor preencha corretamente o campo cpf com um número válido de 11 digitos sem caractéres especiais.\nEx: 11122233344"
        });
        return true;
    };
    return false;
}

function validadorEmail(email, res){
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            mensagem: "Por favor preencha corretamente o campo email.\nEx: email@exemplo.com"
        });
        return true;
    };
    return false;
}

function validadorData_nascimento(data_nascimento, res){
    if (!dataRegex.test(data_nascimento)){
        return res.status(400).json({
            mensagem: "Formato de data inválido. Favor utilize o formato DD/MM/AAA.\nEx: 01/01/1900."
        });
        return true;
    };
    return false;
}

function validadorTelefone(telefone, res){
    if (!/^[0-9]+$/.test(telefone) || telefone.length !== 11) {
        return res.status(400).json({
            mensagem: "Por favor preencha corretamente o campo telefone com um número válido de 11 digitos sem caractéres especiais.\nEx: 71988887777."
        });
        return true;
    };
    return false;
}

function validadorSenha(senha, res){
    if (!/^[0-9]+$/.test(senha) || senha.length !== 4) { 
        return res.status(400).json({
            mensagem: "A senha deve ser um número válido, de 4 digitos, sem carácteres especiais.\nEx: 1234."
        });
        return true;
    };
    return false;
}

module.exports = {
    verificaCpfEmail,
    validadorNumeroDeConta,
    dataAtual,
    validadorNome,
    validadorEmail,
    validadorCpf,
    validadorTelefone,
    validadorData_nascimento,
    validadorSenha
};
