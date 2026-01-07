import argon2 from 'argon2';
import { prisma } from '@/prisma/prisma.js';
import {
  defineUserFactory,
  initialize,
} from '../src/generated/fabbrica/index.js';

initialize({ prisma });

async function seed() {
  const UserFactory = defineUserFactory();

  await UserFactory.createList([
    {
      email: 'admin@example.com',
      name: 'Admin User',
      preferredName: 'Admin',
      role: 'ADMIN',
      emailVerified: true,
      accounts: {
        create: {
          accountId: '4711',
          providerId: 'credential',
          password: await argon2.hash('Admin123!'),
        },
      },
    },
    {
      email: 'user@example.com',
      name: 'Regular User',
      emailVerified: true,
      accounts: {
        create: {
          accountId: '4712',
          providerId: 'credential',
          password: await argon2.hash('User123!'),
        },
      },
    },
  ]);
}

await seed();
await prisma.$disconnect();
