import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordService } from './forgot-password.service';
import { UserEntity } from '../user/entity';
import { prismaMock } from '../prisma/prisma.mock';
import * as crypto from 'crypto';
import { SendMailResponse } from './interfaces';
import { SetPasswordModule } from '../set-password/set-password.module';
describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetPasswordModule],
      providers: [ForgotPasswordService],
    }).compile();

    service = module.get<ForgotPasswordService>(ForgotPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return valid response when sending mail for reset password', async () => {
    const email: string = 'danarcahyadi21@gmail.com';
    const mockUser: UserEntity = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      avatarURL: null,
      refreshToken: null,
      tokenPassword: crypto.randomBytes(32).toString('hex'),
      tokenPasswordExpires: Date.now() + 60 * 60 * 1000,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.update as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.users.findUnique as jest.Mock).mockResolvedValue(mockUser);
    const result = await service.forgotPassword(email);
    const resulExpected: SendMailResponse = {
      status: 'success',
      message: 'We sent email to d......@gmail.com for reset your password',
    };
    console.log(result);
    expect(result).toEqual(resulExpected);
  });
});
