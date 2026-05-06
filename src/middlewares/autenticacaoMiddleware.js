const { ErroApi } = require("../utils/erroApi");
const { verificarToken } = require("../utils/jwtUtil");

function extrairBearerToken(autorizacao) {
  if (!autorizacao || typeof autorizacao !== "string") {
    return null;
  }
  const partes = autorizacao.trim().split(/\s+/);
  if (partes.length === 2 && partes[0].toLowerCase() === "bearer") {
    return partes[1];
  }
  return null;
}

function usuarioAutenticado() {
  return (requisicao, resposta, proximo) => {
    try {
      const token = extrairBearerToken(requisicao.headers.authorization);
      if (!token) {
        throw new ErroApi("Token inválido ou ausente.", 401);
      }
      const payload = verificarToken(token);
      const idUsuario =
        typeof payload.usuarioId === "string"
          ? payload.usuarioId
          : payload.sub ?? payload.userId ?? payload.id;
      if (!idUsuario) {
        throw new ErroApi("Token inválido.", 401);
      }
      requisicao.usuarioAutenticado = { id: idUsuario };
      proximo();
    } catch (erro) {
      if (erro instanceof ErroApi) {
        return resposta.status(erro.codigoStatus).json({ error: erro.message });
      }
      return resposta.status(401).json({ error: "Token inválido ou expirado." });
    }
  };
}

module.exports = {
  usuarioAutenticado,
  extrairBearerToken,
};
