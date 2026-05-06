const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

async function hashSenha(senha) {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

async function compararSenha(senhaInformada, hashArmazenado) {
  return bcrypt.compare(senhaInformada, hashArmazenado);
}

module.exports = { hashSenha, compararSenha };
