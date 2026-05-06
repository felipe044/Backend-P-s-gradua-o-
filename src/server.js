const { prismaCliente } = require("./models/prismaCliente");
const { criarApp } = require("./app");

async function iniciar() {
  const porta = Number(process.env.PORT) || 3000;
  const app = criarApp();

  await prismaCliente.$connect();

  const servidor = app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
  });
  servidor.on("error", (erro) => {
    if (erro && erro.code === "EADDRINUSE") {
      console.error(
        `Porta ${porta} já está em uso. Finalize o processo da porta ou use PORT=4000.`
      );
      process.exit(1);
    }
    console.error("Erro ao subir o servidor:", erro);
    process.exit(1);
  });

  const encerrar = async () => {
    await prismaCliente.$disconnect();
    process.exit(0);
  };
  process.on("SIGINT", encerrar);
  process.on("SIGTERM", encerrar);
}

iniciar().catch((erro) => {
  console.error("Falha ao iniciar servidor:", erro);
  process.exit(1);
});
