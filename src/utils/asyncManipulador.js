/** Encapsula controladores async e encaminha rejeições ao middleware de erro */
function asyncManipulador(controladorFn) {
  return (requisicao, resposta, proximo) =>
    Promise.resolve(controladorFn(requisicao, resposta, proximo)).catch(proximo);
}

module.exports = { asyncManipulador };
