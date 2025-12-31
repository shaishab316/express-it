import { beforeAll, afterAll } from 'vitest';
import { prisma } from '@db';
import { execSync } from 'child_process';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
  execSync('npm run prisma:reset'); //? to reset the database after tests
});
