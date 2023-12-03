import { Body, Controller, Post } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignUpDto } from './DTOs';
import { SkipAuth } from '../auth/decorators';

@SkipAuth()
@Controller('signup')
export class SignupController {
  constructor(private readonly signUpService: SignupService) {}

  @Post()
  async signUp(@Body() dto: SignUpDto) {
    return await this.signUpService.signUp(dto);
  }
}
