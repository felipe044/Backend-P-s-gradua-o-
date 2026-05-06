class ErroApi extends Error {
  constructor(mensagem, codigoStatus = 500) {
    super(mensagem);
    this.name = "ErroApi";
    this.codigoStatus = codigoStatus;
  }
}

module.exports = { ErroApi };
