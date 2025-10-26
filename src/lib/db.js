'use strict';

const { PrismaClient } = require('@prisma/client');

const prismaClientSingleton = () => new PrismaClient();

const globalForPrisma = global;

const prisma = globalForPrisma.__prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

module.exports = prisma;
