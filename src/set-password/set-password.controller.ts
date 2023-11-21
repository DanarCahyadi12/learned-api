import { Controller, Get, Query, Render, UseGuards } from '@nestjs/common';
import { TokenPasswordGuard } from './guards/token-password.guard';
import { SkipAuth } from 'src/auth/decorators';

@UseGuards(TokenPasswordGuard)
@SkipAuth()
@Controller('set-password')
export class SetPasswordController {
  constructor() {}

  @Get()
  @Render('set-password')
  root(@Query('token') token: string) {
    return {
      token,
    };
  }
}
