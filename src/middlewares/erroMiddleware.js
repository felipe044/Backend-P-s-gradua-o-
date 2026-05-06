const { ErroApi } = require("../utils/erroApi");

function middlewareErroGlobal(erro, requisicao, resposta, proximo) {
  if (typeof proximo !== "function") {
    return;
  }

  if (erro instanceof ErroApi) {
    console.error("[erro]", erro.message);
    return resposta.status(erro.codigoStatus).json({ error: erro.message });
  }

  let codigoHttp = erro.codigoStatus ?? erro.statusCode ?? 500;
  let mensagem =
    erro.message && typeof erro.message === "string" ? erro.message : "Erro interno.";

  if (
    erro.esquemaValidacaoErros &&
    Array.isArray(erro.esquemaValidacaoErros) &&
    erro.esquemaValidacaoErros.length
  ) {
    codigoHttp = 400;
    mensagem = erro.esquemaValidacaoErros
      .map((entradaValidacao) => entradaValidacao.msg ?? entradaValidacao.message)
      .filter(Boolean)
      .join("; ");
  }

  if (erro.code === "P2025") {
    codigoHttp = 404;
    mensagem = "Registro não encontrado.";
  }

  if (erro.code === "P2002") {
    codigoHttp = 409;
    mensagem = "Registro duplicado.";
  }

  if (erro.name === "JsonWebTokenError" || erro.name === "TokenExpiredError") {
    codigoHttp = 401;
    mensagem = "Token inválido ou expirado.";
  }

  if (
    erro.name === "UnauthorizedError" ||
    erro.name === "AuthenticationError"
  ) {
    codigoHttp = 401;
    mensagem = erro.message ?? "Token inválido ou expirado.";
  }

  if (codigoHttp < 400 || codigoHttp > 599) {
    codigoHttp = 500;
  }

  const ehErroOcultado =
    codigoHttp === 500 &&
    erro.code !== "P2025" &&
    erro.code !== "P2002" &&
    process.env.NODE_ENV !== "development";

  if (ehErroOcultado) {
    mensagem = "Erro interno.";
  }

  console.error("[erro]", mensagem);

  resposta.status(codigoHttp).json({ error: mensagem });
}

module.exports = { middlewareErroGlobal };
