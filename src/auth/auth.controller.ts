import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './DTOs';
import { Response } from 'express';
import { RefreshTokenGuard } from './guards';
import { Cookies, SkipAuth } from './decorators';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: AuthDto, @Res() res: Response) {
    const response = await this.authService.signIn(dto, res);
    res.json(response);
  }

  @Get('token')
  @SkipAuth()
  @UseGuards(RefreshTokenGuard)
  async getRefreshToken(
    @Request() req,
    @Cookies('token') refreshToken: string,
  ) {
    const { sub } = req.user;
    return this.authService.getRefreshToken(sub, refreshToken);
  }
}
