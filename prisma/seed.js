'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Passw0rd!', 10);

  await prisma.track.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash,
    },
  });

  const project = await prisma.project.create({
    data: {
      name: 'Demo Project',
      owner: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  await prisma.track.create({
    data: {
      name: 'Demo Track',
      filename: 'demo-track.wav',
      project: {
        connect: {
          id: project.id,
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
