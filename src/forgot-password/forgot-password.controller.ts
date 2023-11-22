import { Body, Controller, Post } from '@nestjs/common';
import { SkipAuth } from 'src/auth/decorators';
import { ForgotPasswordService } from './forgot-password.service';

@SkipAuth()
@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}
  @Post()
  async forgotPassword(@Body('email') email: string) {
    return await this.forgotPasswordService.forgotPassword(email);
  }
}
