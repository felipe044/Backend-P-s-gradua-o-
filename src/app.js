require("dotenv").config();

const express = require("express");
const rotas = require("./routes");
const { middlewareErroGlobal } = require("./middlewares/erroMiddleware");

function criarApp() {
  const app = express();

  app.use(express.json());

  app.use("/", rotas);

  app.use(middlewareErroGlobal);

  return app;
}

module.exports = { criarApp };
