const express = require("express");
const { usuarioAutenticado } = require("../middlewares/autenticacaoMiddleware");
const { asyncManipulador } = require("../utils/asyncManipulador");
const { verificarResultadoValidacao } = require("../middlewares/validacaoResultadoMiddleware");
const tarefaControlador = require("../controllers/tarefaControlador");

const roteador = express.Router();

roteador.get("/", asyncManipulador(tarefaControlador.getListarTarefas));

roteador.post(
  "/",
  usuarioAutenticado(),
  tarefaControlador.validadoresCriacaoTarefa,
  verificarResultadoValidacao(),
  asyncManipulador(tarefaControlador.postCriarMinhaTarefa)
);

roteador.get(
  "/:id",
  tarefaControlador.validadorIdTarefa,
  verificarResultadoValidacao(),
  asyncManipulador(tarefaControlador.getTarefaPorId)
);

roteador.put(
  "/:id",
  usuarioAutenticado(),
  tarefaControlador.validadoresAtualizarTarefa,
  verificarResultadoValidacao(),
  asyncManipulador(tarefaControlador.putAtualizarMinhaTarefa)
);

roteador.delete(
  "/:id",
  usuarioAutenticado(),
  tarefaControlador.validadorIdTarefa,
  verificarResultadoValidacao(),
  asyncManipulador(tarefaControlador.deleteRemoverMinhaTarefa)
);

module.exports = roteador;
