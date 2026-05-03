import { PrismaClient } from "@prisma/client";

export const prisma = globalThis.__miniLibraryPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__miniLibraryPrisma = prisma;
}
