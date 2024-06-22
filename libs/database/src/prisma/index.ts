// import { PrismaClient as client } from '@prisma/client';
export * from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma: client }

// export const prismClientInternal =
//   globalForPrisma.prisma ||
//   new client({
//     log: ['query'],
//   })

// if (process.env['NODE_ENV'] !== 'production') globalForPrisma.prisma = prismClientInternal;

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
