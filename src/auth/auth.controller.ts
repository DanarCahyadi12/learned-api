import {
  Body,
  Controller,
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
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { User } from '../user/decorators';
import { AuthResponse } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @SkipAuth()
  @Post('signin')
  async signIn(@Body() dto: AuthDto, @Res() res: Response) {
    const response: AuthResponse = await this.authService.signIn(dto, res);
    return response.code === 200
      ? res.status(200).json({
          status: response.status,
          message: response.message,
          data: response.data,
        })
      : res
          .status(202)
          .json({ status: response.status, message: response.message });
  }

  @SkipAuth()
  @Get('token')
  @UseGuards(RefreshTokenGuard)
  async getRefreshToken(
    @Request() req,
    @Cookies('token') refreshToken: string,
  ) {
    const { sub } = req.user;
    return this.authService.getRefreshToken(sub, refreshToken);
  }

  @Get('signout')
  async signOut(@User() id: string, @Res() res: Response) {
    await this.authService.signOut(id, res);
    return res.sendStatus(204);
  }
  @SkipAuth()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async signInWithGoogle() {}

  @SkipAuth()
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleRedirect(@Request() req, @Res() res) {
    const response = await this.authService.googleRedirect(req.user, res);
    res.json(response);
  }
}
