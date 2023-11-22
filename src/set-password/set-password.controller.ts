import { Controller, Post, Query, UseGuards, Body, Get } from '@nestjs/common';
import { TokenPasswordGuard } from './guards/token-password.guard';
import { SkipAuth } from 'src/auth/decorators';
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
      message: 'Token password is verified',
    };
  }
  @Post()
  async setPassword(
    @Query('userid') userID: string,
    @Body() dto: SetPasswordDto,
  ) {
    console.log(dto);
    return await this.setPasswordService.setPassword(userID, dto);
  }
}
