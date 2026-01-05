import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { YogaDriver, type YogaDriverConfig } from '@graphql-yoga/nestjs';
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import type { Request } from 'express';
import { UsersResolver } from './users.resolver.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

@Module({
  imports: [
    NestGraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      typePaths: [join(__dirname, 'schema.graphql')],
      path: '/graphql',
      context: ({ req }: { req: Request }) => ({ req }),
    }),
  ],
  providers: [UsersResolver],
})
export class GraphQLModule {}
