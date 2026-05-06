const { body } = require("express-validator");
const {
  registrarUsuario,
  fazerLogin,
} = require("../services/autenticacaoServico");

const validadoresRegistro = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório.")
    .isLength({ max: 200 })
    .withMessage("Nome muito longo."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-mail é obrigatório.")
    .isEmail()
    .withMessage("E-mail inválido."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no mínimo 6 caracteres."),
];

const validadoresLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-mail é obrigatório.")
    .isEmail()
    .withMessage("E-mail inválido."),
  body("password").notEmpty().withMessage("Senha é obrigatória."),
];

async function postRegistrarUsuario(requisicao, resposta) {
  const { name, email, password } = requisicao.body;
  const usuario = await registrarUsuario({
    nome: name,
    email,
    senha: password,
  });
  resposta.status(201).json(usuario);
}

async function postLogin(requisicao, resposta) {
  const { email, password } = requisicao.body;
  const resultado = await fazerLogin({
    email,
    senha: password,
  });
  resposta.json(resultado);
}

module.exports = {
  postRegistrarUsuario,
  postLogin,
  validadoresRegistro,
  validadoresLogin,
};
