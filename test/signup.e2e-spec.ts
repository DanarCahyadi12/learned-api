import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SignupModule } from '../src/signup/signup.module';
import { SignUpDto } from '../src/signup/DTOs';
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
      .send(dto)
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

  afterAll(async () => {
    await app.close();
  });
});
