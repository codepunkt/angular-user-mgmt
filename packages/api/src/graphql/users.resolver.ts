import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
// biome-ignore lint/style/useImportType: NestJS DI requires value import for decorator metadata
import { PrismaService } from '../prisma/prisma.service.js';

interface UsersArgs {
  offset: number;
  limit: number;
}

interface UserResult {
  id: string;
  email: string;
  name: string;
  preferredName: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
}

interface UsersConnection {
  items: UserResult[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

@Resolver('User')
export class UsersResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query('users')
  async users(
    @Args() args: UsersArgs,
    @Context() _context: unknown,
  ): Promise<UsersConnection> {
    const { offset, limit } = args;

    // Validate pagination parameters
    if (offset < 0) {
      throw new GraphQLError('Offset must be non-negative', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    if (limit < 1 || limit > 100) {
      throw new GraphQLError('Limit must be between 1 and 100', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    // Fetch users with pagination
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          preferredName: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      items: users,
      total,
      offset,
      limit,
      hasMore: offset + users.length < total,
    };
  }
}
