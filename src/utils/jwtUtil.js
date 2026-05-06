const jwt = require("jsonwebtoken");

function gerarToken(payload) {
  const segredo = process.env.JWT_SECRET;
  if (!segredo) {
    throw new Error("JWT_SECRET não configurado");
  }
  return jwt.sign(payload, segredo, { expiresIn: "7d" });
}

function verificarToken(token) {
  const segredo = process.env.JWT_SECRET;
  if (!segredo) {
    throw new Error("JWT_SECRET não configurado");
  }
  return jwt.verify(token, segredo);
}

module.exports = { gerarToken, verificarToken };
