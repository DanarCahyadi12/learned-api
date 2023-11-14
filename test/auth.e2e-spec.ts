import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaMock, prismaMock } from '../src/prisma/prisma.mock';
import { AuthDto } from '../src/auth/DTOs';
import * as request from 'supertest';
describe('Auth (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
        {
          provide: PrismaMock,
          useValue: prismaMock,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/auth/signin (POST)', async () => {
    const dto: AuthDto = {
      email: 'danar@gmail.com',
      password: '12345678',
    };
    const userUpdated = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danarcahyadi@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      pictureURL: null,
      refreshToken:
        '$2y$10$xdFwD4p1z1g7ckMurp5QVOTB/iw430B2RAygioY1NvnjnKEwCzyh2',
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const user = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danarcahyadi@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      pictureURL: null,
      refreshToken:
        '$2y$10$xdFwD4p1z1g7ckMurp5QVOTB/iw430B2RAygioY1NvnjnKEwCzyh2',
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.findUnique as jest.Mock).mockResolvedValue(user);
    (prismaMock.users.update as jest.Mock).mockResolvedValue(userUpdated);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(dto)
      .expect(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Sign in successfully');
    expect(response.body.data.accessToken).toBeDefined();
  });
  afterAll(async () => {
    await app.close();
  });
});
