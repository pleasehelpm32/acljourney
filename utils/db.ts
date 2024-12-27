import { PrismaClient } from "@prisma/client";

// Extend NodeJS.Global to include our prisma property
declare global {
  var prisma: PrismaClient | undefined;
}

// Disable prepared statements
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: `${process.env.DATABASE_URL}?pgbouncer=true`,
      },
    },
  });
};

// Create a global object for Prisma
const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
