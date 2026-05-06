const { PrismaClient } = require("@prisma/client");

const prismaGlobal = globalThis;

const prismaCliente =
  prismaGlobal.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prismaCliente;
}

module.exports = { prismaCliente };
