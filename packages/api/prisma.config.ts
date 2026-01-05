import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    seed: 'bun prisma/seed.ts',
    adapter: async () => {
      const pg = await import('pg');
      return new pg.default.Pool({
        connectionString: env('DATABASE_URL'),
      });
    },
  },
});
