const knex = require('../conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwt_secret = require('../jwt_secret');

const pwd = securePassword();

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha} = req.body;

  if( !nome || !email || !senha){
    return res.status(400).json('Os campos nome, email e senha são obrigatórios');
  }

  try {

    const buscarEmail = await knex('usuarios').where('email', email).returning('*');

    if(buscarEmail > 0){
      return res.status(400).json('Este email já foi cadastrado');
    }

  } catch (error) {
    
    return res.status(400).json(error.message);

  }

  try {
    
    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

    const usuario = {
      nome: nome,
      email: email,
      senha: hash
    };

    const novoUsuario = await knex('usuarios').insert(usuario).debug();
    
    if(!novoUsuario){
      return res.status(400).json('Não foi possível cadastrar o usuário');
    }

    const cliente = await knex('usuarios').where('email', email).first().returning('id', 'email','nome');
    
     return res.status(200).json({
      id: cliente.id,
      email: cliente.email,
      nome: cliente.nome
     });

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const login = async (req, res) => {
  const { email, senha} = req.body;

  if(!email || !senha){
    return res.status(400).json('Os campos email e senha obrigatórios');
  }

  try{
    const usuarios = await knex('usuarios').where({email: email}).first(); 

    if(!usuarios){
      return res.status(404).json('Email ou senha incorreto');
    }

    const verificarSenha = await pwd.verify(Buffer.from(senha), Buffer.from(usuarios.senha,'hex'));

    switch (verificarSenha) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
      case securePassword.INVALID:
        return res.status(400).json('mensagem: email  ou senha incorreto');
      case securePassword.VALID:
        break;
      case securePassword.VALID_NEEDS_REHASH:
        try {
          const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
          const update = await knex('usuarios').update({senha: hash, email: email}).where('id', id);
        } catch {
        }
      break;
    }

    const token = jwt.sign({
      id: usuarios.id,
      nome: usuarios.nome,
      email: usuarios.email
    }, jwt_secret, { expiresIn: '2h'})


    return res.status(200).json({usuario: {
      id: usuarios.id,
      nome: usuarios.nome,
      email: usuarios.email
    }, token: token
  });

  } catch( error ){

    return res.status(400).json(error.message);

  }

}

const detalharUsuario = async (req, res) => {
  const { usuario } = req;
  
   if( !usuario ){
     return res.status(401).json('Usuario não autenticado');
   }

  try{

    const buscarUsuario = await knex('usuarios').where({id: usuario[0].id}).first();

    if(!buscarUsuario){
      return res.status(400).json('Usuário não encontrado');
    }

     return res.status(200).json({
        id: buscarUsuario.id,
        nome: buscarUsuario.nome,
        email: buscarUsuario.email
     });

  } catch (error){
    return res.status(400).json(error.message);
  }
}

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { usuario } = req;
  
   if( !usuario ){
     return res.status(401).json('Usuario não autenticado');
   }

  if( !nome && !email && !senha){

    return res.status(400).json('O campo que deseja alterar precisa ser informado');

  }

  try {
    const buscarUsuario = await knex('usuarios').where('id', usuario[0].id).first();
    
    if(!buscarUsuario){

      return res.status(400).json('Usuário não identificado');

    }
    
    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
    const atualizarUsuario = await knex('usuarios').update({ 'email': email, 'nome': nome, 'senha': hash}).where('id', buscarUsuario.id);
    
    if(!atualizarUsuario){
      return res.status(400).json('Não foi possível atualizar o usuário');
    }
    
    return res.status(200).json('Usuário atualizado com sucesso!')
  } catch (error) {

    return res.status(400).json(error.message);

  }
}

const deletarUsuario = async (req, res) => {
  const { usuario } = req;
  
   if( !usuario ){
     return res.status(401).json('Usuario não autenticado');
   }

  try{
    const deletarUsuario = await knex('usuarios').del().where('id', usuario[0].id);

    if(!deletarUsuario){
      return res.status(400).json('Nao foi possível deletar o usuário');
    }

    return res.status(200).json('Usuário deletado com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}



module.exports = {
  cadastrarUsuario,
  login,
  detalharUsuario, 
  atualizarUsuario,
  deletarUsuario,
  deletarUsuario
};