const { prismaCliente } = require("../models/prismaCliente");
const { ErroApi } = require("../utils/erroApi");

const STATUS_PERMITIDO = ["pending", "done"];
const CAMPOS_ORDEM_PERMITIDO = ["title", "createdAt"];
const DIRECOES_PERMITIDAS = ["asc", "desc"];

function garantirUsuarioExisteOuErro(usuarioEncontrado) {
  if (!usuarioEncontrado) {
    throw new ErroApi("Usuário não encontrado.", 404);
  }
}

async function garantirTarefaExisteOuErro(identificacao) {
  const tarefa = await prismaCliente.task.findUnique({
    where: { id: identificacao },
  });
  if (!tarefa) {
    throw new ErroApi("Task não encontrada.", 404);
  }
  return tarefa;
}

async function criarTarefaParaUsuario(identificacaoUsuario, { titulo, descricao }) {
  const usuario = await prismaCliente.user.findUnique({
    where: { id: identificacaoUsuario },
  });
  garantirUsuarioExisteOuErro(usuario);
  const tarefaNova = await prismaCliente.task.create({
    data: {
      title: titulo,
      description: descricao ?? null,
      userId: identificacaoUsuario,
    },
  });
  console.log("[log] Task criada:", tarefaNova.id, "| usuário:", identificacaoUsuario);
  return tarefaNova;
}

async function listarTarefas({ status, ordenarPor, direcao, usuarioId }) {
  const filtroWhere = {};

  if (status) {
    if (!STATUS_PERMITIDO.includes(status)) {
      throw new ErroApi("status deve ser pending ou done.", 400);
    }
    filtroWhere.status = status;
  }

  if (usuarioId) {
    filtroWhere.userId = usuarioId;
  }

  let campoOrdem = "createdAt";
  if (ordenarPor && CAMPOS_ORDEM_PERMITIDO.includes(ordenarPor)) {
    campoOrdem = ordenarPor;
  } else if (ordenarPor) {
    throw new ErroApi("sort deve ser title ou createdAt.", 400);
  }

  let sentidoOrdem = "desc";
  if (direcao) {
    if (!DIRECOES_PERMITIDAS.includes(direcao)) {
      throw new ErroApi("order deve ser asc ou desc.", 400);
    }
    sentidoOrdem = direcao;
  }

  return prismaCliente.task.findMany({
    where: filtroWhere,
    orderBy: { [campoOrdem]: sentidoOrdem },
  });
}

async function obterTarefaPorId(identificacao) {
  return garantirTarefaExisteOuErro(identificacao);
}

async function atualizarTarefa(identificacao, { titulo, descricao, status }) {
  await garantirTarefaExisteOuErro(identificacao);
  if (status && !STATUS_PERMITIDO.includes(status)) {
    throw new ErroApi("status deve ser pending ou done.", 400);
  }
  const dadosAtualizar = {};
  if (titulo !== undefined) {
    dadosAtualizar.title = titulo;
  }
  if (descricao !== undefined) {
    dadosAtualizar.description = descricao;
  }
  if (status !== undefined) {
    dadosAtualizar.status = status;
  }
  const atualizada = await prismaCliente.task.update({
    where: { id: identificacao },
    data: dadosAtualizar,
  });
  console.log("[log] Task atualizada:", atualizada.id);
  return atualizada;
}

async function removerTarefa(identificacao) {
  await garantirTarefaExisteOuErro(identificacao);
  await prismaCliente.task.delete({ where: { id: identificacao } });
  console.log("[log] Task removida:", identificacao);
}

async function garantirTarefaPertenceUsuario(identificacao, identificacaoUsuario) {
  const tarefa = await garantirTarefaExisteOuErro(identificacao);
  if (tarefa.userId !== identificacaoUsuario) {
    throw new ErroApi("Não autorizado a alterar esta task.", 403);
  }
  return tarefa;
}

async function atualizarTarefaDoUsuario(
  identificacao,
  identificacaoUsuario,
  alteracoes
) {
  await garantirTarefaPertenceUsuario(identificacao, identificacaoUsuario);
  return atualizarTarefa(identificacao, alteracoes);
}

async function removerTarefaDoUsuario(identificacao, identificacaoUsuario) {
  await garantirTarefaPertenceUsuario(identificacao, identificacaoUsuario);
  return removerTarefa(identificacao);
}

module.exports = {
  criarTarefaParaUsuario,
  listarTarefas,
  obterTarefaPorId,
  atualizarTarefa,
  removerTarefa,
  atualizarTarefaDoUsuario,
  removerTarefaDoUsuario,
};
