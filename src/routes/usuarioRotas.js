const express = require("express");
const { usuarioAutenticado } = require("../middlewares/autenticacaoMiddleware");
const { asyncManipulador } = require("../utils/asyncManipulador");
const { verificarResultadoValidacao } = require("../middlewares/validacaoResultadoMiddleware");
const tarefaControlador = require("../controllers/tarefaControlador");

const roteador = express.Router();

roteador.post(
  "/:id/tasks",
  usuarioAutenticado(),
  tarefaControlador.validadorUsuarioIdDaRota,
  verificarResultadoValidacao(),
  tarefaControlador.validadoresCriacaoTarefa,
  verificarResultadoValidacao(),
  asyncManipulador(tarefaControlador.postCriarTarefaPorUsuarioDaRota)
);

module.exports = roteador;
