import { Injectable } from '@nestjs/common';
import { prisma } from './prisma.js';

/**
 * PrismaService wraps the singleton prisma client and exposes all
 * PrismaClient methods directly via model getters.
 * Use `this.prisma.user.findMany()` syntax in consumers.
 *
 * Connection lifecycle is managed by the singleton in prisma.ts,
 * not by NestJS module lifecycle, to avoid interfering with other
 * consumers of the shared instance (auth, seeds, etc.).
 */
@Injectable()
export class PrismaService {
  private readonly _client = prisma;

  // Expose model accessors directly
  get user() {
    return this._client.user;
  }

  get session() {
    return this._client.session;
  }

  get account() {
    return this._client.account;
  }

  get verification() {
    return this._client.verification;
  }

  get $transaction() {
    return this._client.$transaction.bind(this._client);
  }

  get $queryRaw() {
    return this._client.$queryRaw.bind(this._client);
  }

  get $executeRaw() {
    return this._client.$executeRaw.bind(this._client);
  }
}
