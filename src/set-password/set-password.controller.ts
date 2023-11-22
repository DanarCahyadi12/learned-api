import { Controller, Post, Query, UseGuards, Body, Get } from '@nestjs/common';
import { TokenPasswordGuard } from './guards/token-password.guard';
import { SkipAuth } from '../auth/decorators';
import { SetPasswordDto } from './DTOs';
import { SetPasswordService } from './set-password.service';

@UseGuards(TokenPasswordGuard)
@SkipAuth()
@Controller('set-password')
export class SetPasswordController {
  constructor(private readonly setPasswordService: SetPasswordService) {}

  @Get()
  token() {
    return {
      status: 'success',
      message: 'Verified',
    };
  }
  @Post()
  async setPassword(
    @Query('userid') userID: string,
    @Body() dto: SetPasswordDto,
  ) {
    return await this.setPasswordService.setPassword(userID, dto);
  }
}
