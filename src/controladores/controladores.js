const utils = require('../utils/utils');
const {contas, saques, depositos, transferencias} = require('../bancodedados');
let novoId = 0;
let dataFormatada = "";

function consultaContas(req, res) {
    if (contas.length === 0){
        return res.status(200).json({mensagem: `Nenhuma conta encontrada`, contas});
    } else {
        return res.status(200).json({mensagem: `${contas.length} contas encontradas`, contas});
    }
};

function cadastro(req, res) {
    const usuario = req.body;
    
    if (!usuario.nome || !usuario.email || !usuario.cpf || !usuario.data_nascimento || !usuario.telefone || !usuario.senha){
        return res.status(400).json({
            mensagem: "Por favor preencha todos os dados."
        });
    };
    if (utils.validadorNome(usuario.nome, res)){
        return;
    };
    if (utils.validadorCpf(usuario.cpf, res)){
        return;
    };
    if (utils.validadorEmail(usuario.email, res)){
        return;
    };
    if (utils.validadorData_nascimento(usuario.data_nascimento, res)){
        return;
    } else {
        dataFormatada = usuario.data_nascimento.slice(6, 10) + '-' + usuario.data_nascimento.slice(3, 5) + '-' + usuario.data_nascimento.slice(0, 2)
    };
    if (utils.validadorTelefone(usuario.telefone, res)){
        return;
    };
    if (utils.validadorSenha(usuario.senha, res)){
        return;
    };
    if (utils.verificaCpfEmail(usuario.cpf, usuario.email, res)){
        return;
    };
    novoId ++
    const novaConta = {
        numero: String(novoId),
        saldo: 0,
        usuario: {
            nome: usuario.nome,
            cpf: usuario.cpf,
            data_nascimento: dataFormatada,
            telefone: usuario.telefone,
            email: usuario.email,
            senha: usuario.senha,
        }
    };
    contas.push(novaConta);
    return res.status(201).json({mensagem: "Conta cadastrada com sucesso"});
};

function alterarCadastro(req, res) {
    const numeroConta = req.params.numeroConta;
    const {nome, cpf, email, telefone, data_nascimento, senha} = req.body;
    const usuario = contas.find((user) => user.numero === numeroConta);
    
    if (utils.validadorNumeroDeConta(numeroConta, res)){
        return;
    };
    if (Object.keys(req.body).length === 0){
        return res.status(400).json({
            mensagem: "preencha os dados para serem alterados"
        });
    };
    if (usuario){
        if (utils.verificaCpfEmail(cpf, email, res)){
            return;
        };
        if (nome){
            if (utils.validadorNome(nome, res)){
                return;
            } else {
                usuario.usuario.nome = nome
            }
        };
        if (email){
            if (utils.validadorEmail(email, res)){
                return;
            } else{
                usuario.usuario.email = email
            }
        };
        if (cpf){
            if (utils.validadorCpf(cpf, res)){
                return;
            } else {
                usuario.usuario.cpf = cpf
            };
        };
        if (data_nascimento){
            if (utils.validadorData_nascimento(data_nascimento, res)){
                return;
            } else {
                dataFormatada = data_nascimento.slice(6, 10) + '-' + data_nascimento.slice(3, 5) + '-' + data_nascimento.slice(0, 2)
                usuario.usuario.data_nascimento = dataFormatada
            };
        };
        if (telefone){
            if (utils.validadorTelefone(telefone, res)){
                return;
            } else {
                usuario.usuario.telefone = telefone
            };
        };
        if (senha){
            if (utils.validadorSenha(senha, res)){
                return;
            } else {
                usuario.usuario.senha = senha
            };
        };
        return res.status(201).json({ 
            mensagem: "Conta atualizada com sucesso"
        });
    } else {
        return res.status(404).json({
            mensagem: "Usuário não encontrado"
        });
    };
};

function deletar(req, res) {
    const numeroConta = req.params.numeroConta;
    const usuarioDeletar = contas.find((usuario) => usuario.numero == numeroConta);

    if (utils.validadorNumeroDeConta(numeroConta, res)){
        return;
    };
    if (usuarioDeletar){
        if (usuarioDeletar.saldo > 0){
            return res.status(403).json({
                mensagem: "Não é possível apagar contas com saldo maior que R$ 0,00"
            });
        } else {
            contas.splice(contas.indexOf(usuarioDeletar),1)
        return res.status(201).json({
            mensagem: "Conta excluída com sucesso"
        });
        };
    } else {
        return res.status(404).json({
             mensagem: "usuario não encontrado"
        });
    };
};

function deposito(req, res) {
    const requisicao = req.body;
    const usuario = contas.find((user) => user.numero == requisicao.numero_conta);

    if (usuario){
        if (requisicao.valor > 0){
            registro = {
                data: utils.dataAtual(),
                numero_conta: requisicao.numero_conta,
                valor: requisicao.valor
                };
            depositos.push(registro);
            usuario.saldo += requisicao.valor;
            return res.status(201).json({ 
            mensagem: "Depósito realizado com sucesso"
            });
        } else {
            return res.status(400).json({ 
                mensagem: "Válor de depósito inválido"
            });
        }
    };
};

function saque(req, res) {
    const requisicao = req.body;
    const usuario = contas.find((user) => user.numero == requisicao.numero_conta);

    if (usuario){
        if (requisicao.valor <= 0){
            return res.status(400).json({ 
                mensagem: "Valor para saque inválido"
            });
        } else {
            if (requisicao.valor <= usuario.saldo){
                registro = {
                    data: utils.dataAtual(),
                    numero_conta: requisicao.numero_conta,
                    valor: requisicao.valor
                    };
                saques.push(registro);
                usuario.saldo -= requisicao.valor;
                return res.status(201).json({ 
                mensagem: "Saque realizado com sucesso"
                });
            } else {
                return res.status(400).json({ 
                    mensagem: "Saldo em conta insuficiente para o saque"
                });
            };;
        };
    };
};

function transferencia(req, res) {
    const requisicao = req.body;
    const contaOrigem = contas.find((user) => user.numero == requisicao.numero_conta_origem);
    const contaDestino = contas.find((user) => user.numero == requisicao.numero_conta_destino);

    if (contaDestino){
        if (requisicao.valor <= 0){
            return res.status(201).json({ 
                mensagem: "Valor para transferência inválido"
            });
        };
        if (contaDestino === contaOrigem){
            return res.status(400).json({ 
                mensagem: "Não é possivél realizar a transferência. Conta destino e conta de origem iguais."
            });
        };
        if (requisicao.valor <= contaOrigem.saldo){
            registro = {
                data: utils.dataAtual(),
                numero_conta_origem: requisicao.numero_conta_origem,
                numero_conta_destino: requisicao.numero_conta_destino,
                valor: requisicao.valor
                };
            transferencias.push(registro);
            contaOrigem.saldo -= requisicao.valor;
            contaDestino.saldo += requisicao.valor;
            return res.status(201).json({ 
                mensagem: "Transferência realizada com sucesso"
            });
        } else {
            return res.status(404).json({ 
                mensagem: "Saldo em conta insuficiente para transferência"
            });
        };
    } else if (!contaDestino){
        return res.status(404).json({ 
            mensagem: "Conta de destino da transferencia não localizada"
        });
    };
};

function consultaSaldo(req, res) {
    const numero_conta = req.query.numero_conta;
    let usuario = contas.find((user) => user.numero === numero_conta);

    return res.status(201).json({mensagem: `Saldo: ${usuario.saldo}`});
};

function consultaExtrato(req, res) {
    const numero_conta = req.query.numero_conta;

    const extrato = {
        depositos: depositos.filter((registro) => registro.numero_conta === numero_conta),
        saques: saques.filter((registro) => registro.numero_conta === numero_conta),
        transferenciasEnviadas: transferencias.filter((registro) => registro.numero_conta_origem === numero_conta),
        transferenciasRecebidas: transferencias.filter((registro) => registro.numero_conta_destino === numero_conta)
    };

    return res.status(200).json({ mensagem: extrato });
}

module.exports = {
    consultaContas, 
    cadastro, 
    alterarCadastro, 
    deletar, 
    deposito, 
    saque, 
    transferencia, 
    consultaSaldo, 
    consultaExtrato
};
