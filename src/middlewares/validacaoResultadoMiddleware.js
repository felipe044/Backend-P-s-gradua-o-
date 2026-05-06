const { validationResult } = require("express-validator");

function verificarResultadoValidacao(mensagem = "Erro de validação.") {
  return (requisicao, resposta, proximo) => {
    const resultado = validationResult(requisicao);
    if (!resultado.isEmpty()) {
      const erroValidacao = new Error(mensagem);
      erroValidacao.codigoStatus = 400;
      erroValidacao.esquemaValidacaoErros = resultado.array();
      return proximo(erroValidacao);
    }
    proximo();
  };
}

module.exports = { verificarResultadoValidacao };
