import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { GraphQLModule } from './graphql/graphql.module.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, AuthModule, HealthModule, GraphQLModule],
})
export class AppModule {}
