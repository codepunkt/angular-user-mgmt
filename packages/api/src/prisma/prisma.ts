import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client.js';

type PrismaClientWithEvents = PrismaClient<'query' | 'info' | 'warn' | 'error'>;

const globalForPrisma = global as unknown as { prisma: PrismaClientWithEvents };

const adapter = new PrismaPg({
  // @todo environment variable validation and strict typing on startup.
  // biome-ignore lint/style/noNonNullAssertion: DATABASE_URL must exist.
  connectionString: process.env.DATABASE_URL!,
});

/**
 * This setup guarantees that if some form of hot-reloading is implemented in
 * development, this doesn't lead to multiple instances of the prisma client
 * being created, which might otherwise consume resources and might cause
 * unexpected behavior like exhausting the database connection pool.
 *
 * @see https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help#avoid-multiple-prisma-client-instances
 * ```
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: [
      { level: 'query', emit: 'event' },
      { level: 'info', emit: 'stdout' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
