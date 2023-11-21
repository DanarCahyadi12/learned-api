import { Test, TestingModule } from '@nestjs/testing';
import { SetPasswordService } from './set-password.service';

describe('SetPasswordService', () => {
  let service: SetPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetPasswordService],
    }).compile();

    service = module.get<SetPasswordService>(SetPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
