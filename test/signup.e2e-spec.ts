import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SignupModule } from '../src/signup/signup.module';
import { SignUpDto } from '../src/signup/DTOs';
import { PrismaMock, prismaMock } from '../src/prisma/prisma.mock';
describe('Sign up (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [SignupModule],
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

  it('/signup (POST)', async () => {
    const dto: SignUpDto = {
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '12345678',
    };
    const user = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danarcahyadi@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      pictureURL: null,
      refreshToken: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.create as jest.Mock).mockResolvedValue(user);
    const response = await request(app.getHttpServer())
      .post('/signup')
      .send(dto)
      .expect(201);

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Sign up successfully');
    expect(response.body.data.id).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
