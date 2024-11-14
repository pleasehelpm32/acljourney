import { PrismaClient } from "@prisma/client";

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

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Use the singleton pattern to ensure the client is reused in development
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
