import { PrismaClient } from '@prisma/client';

let prismaMock: jest.Mocked<PrismaClient>;

export const PrismaMock = jest.fn(() => {
  if (!prismaMock) {
    prismaMock = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      users: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      // Add mock implementations for Prisma methods you use in your code
      // Example: user: { findUnique: jest.fn(), create: jest.fn(), ... },
    } as unknown as jest.Mocked<PrismaClient>;
  }
  return prismaMock;
});

export { prismaMock };
