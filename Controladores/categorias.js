const knex = require('../conexao');

const listarCategorias = async (req, res) => {
  const { usuario } = req;
  
   if( !usuario ){
     return res.status(401).json('Usuario não autenticado');
   }

  try{
    const lista = await knex('categorias').returning('*');
    
    if(!lista){
      return res.status(400).json("Não foi possível encontrar a lista de categorias");
    }
    
    return res.status(200).json(lista);
  } catch( error ) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  listarCategorias
};