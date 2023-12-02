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
      email: 'danarcahyadi@gmail.com',
      password: '12345678',
    };
    const userMock = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danarcahyadi@gmail.com',
      password: '$2a$12$xxE.Rn.24xQHU45owPx81OR/cpKRW8ueeR/mnbsklB3WOO/mcaQTW',
      pictureURL: null,
      refreshToken:
        '$2y$10$xdFwD4p1z1g7ckMurp5QVOTB/iw430B2RAygioY1NvnjnKEwCzyh2',
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.findUnique as jest.Mock).mockResolvedValue(userMock);
    (prismaMock.users.update as jest.Mock).mockResolvedValue(userMock);

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

  it('/auth/signin (POST). Should send an email and return 202 http status code', async () => {
    const dto: AuthDto = {
      email: 'danarcahyadi@gmail.com',
      password: '12345678',
    };
    const userMock = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danarcahyadi@gmail.com',
      password: null,
      pictureURL: null,
      refreshToken: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.findUnique as jest.Mock).mockResolvedValue(userMock);
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(dto)
      .expect(202);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
    expect(response.body.status).toBe('accepted');
    expect(response.body.message).toBe(
      'We sent email to d******@gmail.com with a link to set your password account',
    );
  });

  it('/auth/signin (POST). Return a bad requuest payload', async () => {
    const dto: AuthDto = {
      email: 'danarcahyadi@gmail.com',
      password: '12345678invalidpassword',
    };
    const userMock = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danarcahyadi@gmail.com',
      password: '$2a$12$xxE.Rn.24xQHU45owPx81OR/cpKRW8ueeR/mnbsklB3WOO/mcaQTW',
      pictureURL: null,
      refreshToken: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.findUnique as jest.Mock).mockResolvedValue(userMock);
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(dto)
      .expect(400);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toStrictEqual([
      'Email or password is incorrect',
    ]);
  });
  afterAll(async () => {
    await app.close();
  });
});
