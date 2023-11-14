import { Test, TestingModule } from '@nestjs/testing';
import { SignupService } from './signup.service';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import { SignUpDto } from './DTOs';
import { UserModule } from '../user/user.module';

describe('SignupService', () => {
  let signUpService: SignupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [
        SignupService,
        {
          provide: PrismaMock,
          useValue: prismaMock,
        },
      ],
    }).compile();

    signUpService = module.get<SignupService>(SignupService);
  });

  it('should be defined', () => {
    expect(signUpService).toBeDefined();
  });

  it('Should return valid response', async () => {
    const response = {
      status: 'success',
      message: 'Sign up successfully',
      data: {
        id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      },
    };
    jest
      .spyOn(signUpService, 'signUp')
      .mockImplementation(async () => response);
    const dto: SignUpDto = {
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '12345678',
    };

    const result = await signUpService.signUp(dto);
    expect(result).toHaveProperty('status');
    expect(result.status).toBe('success');
    expect(result.message).toBe('Sign up successfully');
    expect(result).toHaveProperty('data');
    expect(result.data).toHaveProperty('id');
    expect(result.data.id).toBe('cdfe9601-dfb2-4708-9449-f36e446e1b11');
  });
});
