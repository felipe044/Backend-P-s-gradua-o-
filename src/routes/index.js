const express = require("express");
const autenticacaoRotas = require("./autenticacaoRotas");
const tarefaRotas = require("./tarefaRotas");
const usuarioRotas = require("./usuarioRotas");

const roteadorPrincipal = express.Router();

roteadorPrincipal.get("/health", (requisicao, resposta) => {
  resposta.json({ status: "ok" });
});

roteadorPrincipal.use("/auth", autenticacaoRotas);
roteadorPrincipal.use("/tasks", tarefaRotas);
roteadorPrincipal.use("/users", usuarioRotas);

module.exports = roteadorPrincipal;
