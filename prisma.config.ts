import './src/config/configure';
import path from 'path';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: path.resolve('src/modules'),
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: path.resolve('prisma/migrations'),
  },
});
