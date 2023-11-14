import { Test } from '@nestjs/testing';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { SignUpDto } from './DTOs';
import { UserModule } from '../user/user.module';

describe('Sign up controller', () => {
  let signUpController: SignupController;
  let signUpService: SignupService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
      controllers: [SignupController],
      providers: [SignupService],
    }).compile();
    signUpController = moduleRef.get<SignupController>(SignupController);
    signUpService = moduleRef.get<SignupService>(SignupService);
  });

  it('Should return a valid response after signup', async () => {
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
    const result = await signUpController.signUp(dto);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');
    expect(result.data).toHaveProperty('id');
    expect(result.status).toBe('success');
    expect(result.message).toBe('Sign up successfully');
    expect(result.data.id).toBe('cdfe9601-dfb2-4708-9449-f36e446e1b11');
  });
});
