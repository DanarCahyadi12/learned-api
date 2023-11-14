import { PrismaMock } from './prisma.mock';

jest.mock('@prisma/client', () => ({
  PrismaClient: PrismaMock,
}));
