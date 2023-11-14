import { Body, Controller, Post } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignUpDto } from './DTOs';

@Controller('signup')
export class SignupController {
  constructor(private readonly signUpService: SignupService) {}

  @Post()
  async signUp(@Body() dto: SignUpDto) {
    return this.signUpService.signUp(dto);
  }
}
