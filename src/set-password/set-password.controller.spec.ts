import { Test, TestingModule } from '@nestjs/testing';
import { SetPasswordController } from './set-password.controller';

describe('SetPasswordController', () => {
  let controller: SetPasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SetPasswordController],
    }).compile();

    controller = module.get<SetPasswordController>(SetPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
