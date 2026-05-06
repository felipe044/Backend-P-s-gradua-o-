const express = require("express");
const { asyncManipulador } = require("../utils/asyncManipulador");
const { verificarResultadoValidacao } = require("../middlewares/validacaoResultadoMiddleware");
const autenticacaoControlador = require("../controllers/autenticacaoControlador");

const roteador = express.Router();

roteador.post(
  "/register",
  autenticacaoControlador.validadoresRegistro,
  verificarResultadoValidacao(),
  asyncManipulador(autenticacaoControlador.postRegistrarUsuario)
);

roteador.post(
  "/login",
  autenticacaoControlador.validadoresLogin,
  verificarResultadoValidacao(),
  asyncManipulador(autenticacaoControlador.postLogin)
);

module.exports = roteador;
