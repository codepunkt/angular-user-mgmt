import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { Request } from 'express';
import { GraphQLError } from 'graphql';
import { auth } from '../auth/auth.js';
// biome-ignore lint/style/useImportType: NestJS DI requires value import for decorator metadata
import { PrismaService } from '../prisma/prisma.service.js';

interface GraphQLContext {
  req: Request;
}

interface UsersArgs {
  offset: number;
  limit: number;
}

interface UpdateUserArgs {
  id: string;
  input: {
    name?: string;
    preferredName?: string;
    role?: 'ADMIN' | 'USER';
  };
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

  @Mutation('updateUser')
  async updateUser(
    @Args() args: UpdateUserArgs,
    @Context() context: GraphQLContext,
  ): Promise<UserResult> {
    const { id, input } = args;

    // Get the current session
    const session = await auth.api.getSession({
      headers: context.req.headers as unknown as Headers,
    });

    if (!session?.user) {
      throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    // Check if the current user is an admin
    const currentUser = await this.prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== 'ADMIN') {
      throw new GraphQLError('Only admins can update users', {
        extensions: { code: 'FORBIDDEN' },
      });
    }

    // Check if the target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    // Prevent admins from changing their own role
    if (input.role !== undefined && id === session.user.id) {
      throw new GraphQLError('You cannot change your own role', {
        extensions: { code: 'FORBIDDEN' },
      });
    }

    // Build update data
    const updateData: {
      name?: string;
      preferredName?: string | null;
      role?: 'ADMIN' | 'USER';
    } = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.preferredName !== undefined) {
      updateData.preferredName = input.preferredName;
    }
    if (input.role !== undefined) {
      updateData.role = input.role;
    }

    // Update the user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        preferredName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }
}
