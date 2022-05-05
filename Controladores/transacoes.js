const knex = require('../conexao')

const listarTransacoes = async (req, res) => {
  const { usuario } = req

  if (!usuario) {
    return res.status(401).json('Usuario não autenticado')
  }

  try {
    const buscarTransacoes = await knex('transacoes').where('usuario_id', usuario[0].id);

    if (!buscarTransacoes) {
      return res.status(400).json('Não foi possível localizar as transações do usuário!');
    }

    return res.status(200).json(buscarTransacoes);

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const cadastrarTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body
  const { usuario } = req

  if (!usuario) {
    return res.status(401).json('Usuario não autenticado')
  }

  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return res.status(400).json('Os campos descria,valor,data,categoria_id e tipo deve ser informados');
  }

  try {
    const categoria = await knex('categorias').where({ id: categoria_id })

    if (!categoria) {
      return res.status(400).json('Categoria não encontrada!')
    }

    const novaTransacao = await knex('transacoes').insert({
      descricao: descricao,
      valor: valor,
      data: data,
      usuario_id: usuario[0].id,
      categoria_id: categoria_id,
      tipo: tipo,
      categoria_nome: categoria[0].descricao
    })

    if (!novaTransacao) {
      return res.status(400).json('Não foi possível cadastrar a nova transação. Verifique os campos obrigatórios.');
    }

    const ultimaTransacao = await knex('transacoes').where({ usuario_id: usuario[0].id }).orderBy('id', 'desc');

    return res.status(200).json(ultimaTransacao[0]);
    
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const atualizarTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id } = req.params;
  const { usuario } = req;

  if (!usuario) {
    return res.status(401).json('Usuario não autenticado');
  }

  if (!descricao && !valor && !data && !categoria_id && !tipo) {
    return res.status(400).json('Os campos descricao, valor, data e categoria_id são obrigatórios');
  }

  try {
    const transacaoSelecionada = await knex('transacoes').where({ id: id, usuario_id: usuario[0].id });

    if (!transacaoSelecionada) {
      return res.status(400).json('Transação do usuário não encontrada!')
    }

  } catch (error) {
    return res.status(400).json(error.message)
  }

  try {
    const categorias = await knex('categorias');
    const categoria = categorias[categoria_id - 1];

    const transacaoAtualizada = await knex('transacoes').update({descricao, valor, data, usuario_id: usuario[0].id, tipo,categoria_nome: categoria.descricao})
      .where({ id: id, usuario_id: usuario[0].id });
    

    if (!transacaoAtualizada) {
      return res.status(400).json('Não foi possível atualizar a transação deste usuário!');
    }

    return res.status(200).json(transacaoAtualizada);

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const deletarTransacao = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;

  if (!usuario) {
    return res.status(401).json('Usuario não autenticado')
  }

  try {
    const deletarTransacao = await knex('transacoes').del().where({ id: id, usuario_id: usuario[0].id });

    if (!deletarTransacao) {
      return res.status(400).json('Não foi possível deletar a transação deste usuário!');
    }

    return res.status(200).json('Transação deletada com sucesso!!');

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const obterExtrato = async (req, res) => {
  const { usuario } = req;

  if (!usuario) {
    return res.status(401).json('Usuario não autenticado');
  }

  try {
    
    const transacoesEntrada = await knex('transacoes').sum('valor').where({ usuario_id: usuario[0].id, tipo: 'entrada' }).groupBy('tipo');
    
    if (!transacoesEntrada) {
      return res.status(400).json('Não foi possível localizar as transações de entrada do usuário');
    }

    
    const transacoesSaida = await knex('transacoes').sum('valor').where({ usuario_id: usuario[0].id, tipo: 'saida' }).groupBy('tipo');

    if (!transacoesSaida) {
      return res.status(400).json('Não foi possível localizar as transações de saida do usuário');
    }

    return res.status(200).json({entrada: transacoesEntrada[0].sum, saida:transacoesSaida[0].sum});

  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = {
  listarTransacoes,
  cadastrarTransacao,
  atualizarTransacao,
  deletarTransacao,
  obterExtrato
}
