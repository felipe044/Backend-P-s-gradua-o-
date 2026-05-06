const { prismaCliente } = require("../models/prismaCliente");
const { ErroApi } = require("../utils/erroApi");
const { hashSenha, compararSenha } = require("../utils/senhaUtil");
const { gerarToken } = require("../utils/jwtUtil");

function usuarioParaResposta(usuario) {
  if (!usuario) {
    return null;
  }
  const { password, senha: _senha, ...demaisCampos } = usuario;
  return demaisCampos;
}

async function registrarUsuario({ nome, email, senha }) {
  const emailNormalizado = String(email).trim().toLowerCase();
  const existente = await prismaCliente.user.findUnique({
    where: { email: emailNormalizado },
  });
  if (existente) {
    throw new ErroApi("Este e-mail já está em uso.", 409);
  }
  const senhaHasheada = await hashSenha(senha);
  const novoUsuario = await prismaCliente.user.create({
    data: {
      name: nome,
      email: emailNormalizado,
      password: senhaHasheada,
    },
  });
  console.log("[log] Usuário criado:", novoUsuario.email);
  return usuarioParaResposta(novoUsuario);
}

async function fazerLogin({ email, senha }) {
  const emailNormalizado = String(email).trim().toLowerCase();
  const usuario = await prismaCliente.user.findUnique({
    where: { email: emailNormalizado },
  });
  if (!usuario) {
    throw new ErroApi("Usuário não encontrado.", 404);
  }
  const senhaConfere = await compararSenha(senha, usuario.password);
  if (!senhaConfere) {
    throw new ErroApi("Credenciais inválidas.", 401);
  }
  const token = gerarToken({ usuarioId: usuario.id });
  console.log("[log] Login bem-sucedido:", usuario.email);
  return {
    token,
    user: usuarioParaResposta(usuario),
  };
}

module.exports = {
  registrarUsuario,
  fazerLogin,
  usuarioParaResposta,
};
