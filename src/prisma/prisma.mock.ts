import { PrismaClient } from '@prisma/client';

let prismaMock: jest.Mocked<PrismaClient>;

export const PrismaMock = jest.fn(() => {
  if (!prismaMock) {
    prismaMock = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $queryRaw: jest.fn(),
      users: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
      },
      classroom: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      assignments: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      classroom_participants: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        aggregate: jest.fn(),
        findFirst: jest.fn(),
      },
      materials: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
      },
      material_files: {
        create: jest.fn(),
        createMany: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      // Add mock implementations for Prisma methods you use in your code
      // Example: user: { findUnique: jest.fn(), create: jest.fn(), ... },
    } as unknown as jest.Mocked<PrismaClient>;
  }
  return prismaMock;
});

export { prismaMock };
