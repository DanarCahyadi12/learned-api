import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SignupModule } from '../src/signup/signup.module';
import { SignUpDto } from '../src/signup/DTOs';
import { prismaMock } from '../src/prisma/prisma.mock';
describe('Sign up (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [SignupModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST signup', async () => {
    const dto: SignUpDto = {
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '12345678',
    };
    const response = await request(app.getHttpServer())
      .post('/signup')
      .send({ data: dto })
      .expect(201)
      .expect('Created');

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Sign up successfully');
    expect(response.body.data.id).toBeDefined();
  });

  it('/POST signup (negative)', async () => {
    const user = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      pictureURL: null,
      refreshToken: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.create as jest.Mock).mockResolvedValue(user);
    const dto: SignUpDto = {
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '12345678',
    };
    const response = await request(app.getHttpServer())
      .post('/signup')
      .send({ data: dto })
      .expect(400)
      .expect('Bad request');

    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('code');
    expect(response.body.statusCode).toBe(400);
    expect(response.body.error).toBe('Bad request');
    expect(response.body.message).toBe('Email is already registered');
  });
});
