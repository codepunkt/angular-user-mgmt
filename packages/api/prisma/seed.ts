import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { auth } from '../src/auth/auth.js';
import { PrismaClient, Role } from '../src/generated/prisma/index.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123!';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin User',
      },
    });

    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: Role.ADMIN,
        preferredName: 'Admin',
        emailVerified: true,
      },
    });

    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  const userEmail = 'user@example.com';
  const userPassword = 'User123!';

  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!existingUser) {
    await auth.api.signUpEmail({
      body: {
        email: userEmail,
        password: userPassword,
        name: 'Regular User',
      },
    });

    await prisma.user.update({
      where: { email: userEmail },
      data: {
        role: Role.USER,
        preferredName: null,
        emailVerified: true,
      },
    });

    console.log(`Created regular user: ${userEmail}`);
  } else {
    console.log(`Regular user already exists: ${userEmail}`);
  }

  await prisma.$disconnect();
  console.log('Seeding complete!');
}

main().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
});
