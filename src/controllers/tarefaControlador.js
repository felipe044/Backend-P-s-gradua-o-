const { body, param } = require("express-validator");
const servicoTarefa = require("../services/tarefaServico");
const { ErroApi } = require("../utils/erroApi");

const validadoresCriacaoTarefa = [
  body("title").trim().notEmpty().withMessage("title é obrigatório."),
  body("description").optional({ nullable: true }).isString(),
];

const validadoresAtualizarTarefa = [
  param("id").trim().notEmpty().withMessage("id inválido."),
  body("title").optional({ nullable: false }).trim().notEmpty(),
  body("description").optional({ nullable: true }),
  body("status")
    .optional()
    .isIn(["pending", "done"])
    .withMessage("status deve ser pending ou done."),
];

const validadorIdTarefa = [
  param("id").trim().notEmpty().withMessage("id inválido."),
];

async function postCriarMinhaTarefa(requisicao, resposta) {
  const { title, description } = requisicao.body;
  const tarefa = await servicoTarefa.criarTarefaParaUsuario(
    requisicao.usuarioAutenticado.id,
    { titulo: title, descricao: description }
  );
  resposta.status(201).json(tarefa);
}

async function getListarTarefas(requisicao, resposta) {
  const { status, sort, order, userId } = requisicao.query;
  const itens = await servicoTarefa.listarTarefas({
    status,
    ordenarPor: sort,
    direcao: order,
    usuarioId: userId,
  });
  resposta.json(itens);
}

async function getTarefaPorId(requisicao, resposta) {
  const tarefa = await servicoTarefa.obterTarefaPorId(requisicao.params.id);
  resposta.json(tarefa);
}

async function putAtualizarMinhaTarefa(requisicao, resposta) {
  const { title, description, status } = requisicao.body;
  if (title === undefined && description === undefined && status === undefined) {
    throw new ErroApi(
      "Informe pelo menos um campo para atualizar (title, description ou status).",
      400
    );
  }
  const tarefa = await servicoTarefa.atualizarTarefaDoUsuario(
    requisicao.params.id,
    requisicao.usuarioAutenticado.id,
    { titulo: title, descricao: description, status }
  );
  resposta.json(tarefa);
}

async function deleteRemoverMinhaTarefa(requisicao, resposta) {
  await servicoTarefa.removerTarefaDoUsuario(
    requisicao.params.id,
    requisicao.usuarioAutenticado.id
  );
  resposta.status(204).send();
}

async function postCriarTarefaPorUsuarioDaRota(requisicao, resposta) {
  const idDaRota = requisicao.params.id;
  if (idDaRota !== requisicao.usuarioAutenticado.id) {
    throw new ErroApi(
      "Você só pode criar tarefas para o próprio usuário autenticado.",
      403
    );
  }
  const { title, description } = requisicao.body;
  const tarefa = await servicoTarefa.criarTarefaParaUsuario(idDaRota, {
    titulo: title,
    descricao: description,
  });
  resposta.status(201).json(tarefa);
}

const validadorUsuarioIdDaRota = [
  param("id").trim().notEmpty().withMessage("id de usuário inválido."),
];

module.exports = {
  validadoresCriacaoTarefa,
  validadoresAtualizarTarefa,
  validadorIdTarefa,
  validadorUsuarioIdDaRota,
  postCriarMinhaTarefa,
  getListarTarefas,
  getTarefaPorId,
  putAtualizarMinhaTarefa,
  deleteRemoverMinhaTarefa,
  postCriarTarefaPorUsuarioDaRota,
};
