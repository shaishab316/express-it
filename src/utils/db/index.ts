import { PrismaClient } from '@/../prisma/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import config from '@/config';
export * from '@/../prisma/client/client';
export * from './exists';

/**
 * Prisma Client instance
 */
export const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new pg.Pool({
      connectionString:
        config.url.database +
        (config.server.node_env === 'test' ? '-test' : ''), //? ensure test DB is used in test env
    }),
  ),
});

/** Connect to the database */
export async function connectDB() {
  await prisma.$connect();

  return () => prisma.$disconnect();
}
