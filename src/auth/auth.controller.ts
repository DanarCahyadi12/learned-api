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
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { MailService } from 'src/mail/mail.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailService: MailService,
  ) {}
  @SkipAuth()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: AuthDto, @Res() res: Response) {
    const response = await this.authService.signIn(dto, res);
    res.json(response);
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
  async signOut(@Request() req, @Res() res: Response) {
    const { sub } = req.user;
    await this.authService.signOut(sub, res);
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

  @SkipAuth()
  @Get('reset-password')
  async resetPaswordl() {
    this.mailService.sendEmail();
  }
}
