const jwt = require('jsonwebtoken');
const jwt_secret = require('../jwt_secret');
const knex = require('../conexao');

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization){
    return res.status(400).json('O token precisa ser informado')
  }

  const array = authorization.split(' ');
  const token = array[1];
  
  try{
    const decoded = await jwt.verify(token, jwt_secret);
    
    if(!decoded){
      return res.status(400).json('O token expirou');
    }

    const usuario = await knex('usuarios').where('id', decoded.id);

    if(!usuario){
      return res.status(400).json('Usuario não encontrado');
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = auth;