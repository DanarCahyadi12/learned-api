import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto, GooglePayloadDto } from './DTOs';
import { Response } from 'express';
import { UserEntity } from '../user/entity';
import { AuthResponse } from './interfaces';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { SetPasswordDto } from './DTOs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private user: UserEntity;
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(dto: AuthDto, res: Response): Promise<AuthResponse> {
    if (!dto.email) throw new BadRequestException('Email is required');
    if (!dto.password) throw new BadRequestException('Password is required');

    const user: boolean | UserEntity = await this.validate(dto);
    if (!user) throw new BadRequestException('Email or password is incorrect');
    if (!user.password) {
      const token: string = crypto.randomBytes(32).toString('hex');
      const url: string = `${process.env.CLIENT_SET_PASSWORD_ENDPOINT}?token=${token}&userid=${user.id}`;
      const mailDto: SetPasswordDto = {
        id: user.id,
        to: user.email,
        token: token,
        expires: Date.now() + 60 * 60 * 1000,
        subject: `Dear ${user.name}.`,
        html: 'set-password',
        variable: {
          url,
          name: user.name,
          description: `We need to set your password account before you're logged in. This link will expires in 1 hours from now`,
        },
      };

      await this.sendEmailForSetPassword(mailDto);
      const response: AuthResponse = {
        status: 'accepted',
        message: `We sent email to ${user.email[0]}******@gmail.com with a link to set your password account`,
        code: 202,
      };

      return Promise.resolve(response);
    }
    const accessToken: string = await this.generateAccessToken(user.id);
    const refreshToken: string = await this.generateRefreshToken(user.id);
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);

    await this.userService.updateRefreshTokenUser(user.id, hashedRefreshToken);
    res.cookie('token', refreshToken, {
      maxAge: 3 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

    const response: AuthResponse = {
      status: 'success',
      message: 'Sign in successfully',
      code: 200,
      data: {
        accessToken,
      },
    };
    return Promise.resolve(response);
  }

  async validate(dto: AuthDto): Promise<false | UserEntity> {
    const user: UserEntity = await this.userService.findOneByEmail(dto.email);
    if (!user) return false;
    const { password } = user;
    if (!password) return user;
    const matchPassword = await bcrypt.compare(dto.password, password);
    if (!matchPassword) return false;
    return user;
  }

  async generateAccessToken(sub: string): Promise<string> {
    return await this.jwtService.signAsync(
      { sub },
      { expiresIn: '1h', secret: process.env.ACCESS_TOKEN_SECRET },
    );
  }
  async generateRefreshToken(sub: string): Promise<string> {
    return await this.jwtService.signAsync(
      { sub },
      { expiresIn: '3d', secret: process.env.REFRESH_TOKEN_SECRET },
    );
  }

  async getRefreshToken(
    sub: string,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const user: UserEntity = await this.userService.findOneById(sub);
    if (!user) throw new NotFoundException('User not found');

    const isValidRefreshToken = await this.validateRefreshToken(
      refreshToken,
      user.refreshToken,
    );
    if (!isValidRefreshToken) throw new UnauthorizedException();
    const newAccessToken: string = await this.generateAccessToken(user.id);
    return {
      status: 'success',
      message: 'Get access token successfullt',
      data: {
        accessToken: newAccessToken,
      },
    };
  }

  async validateRefreshToken(refreshToken: string, hashedRefreshToken: string) {
    return (await bcrypt.compare(refreshToken, hashedRefreshToken))
      ? true
      : false;
  }

  async signOut(id: string, res: Response) {
    await this.userService.updateRefreshTokenUser(id, null);
    res.clearCookie('token');
  }

  async googleRedirect(
    payload: GooglePayloadDto,
    res: Response,
  ): Promise<AuthResponse> {
    this.user = await this.userService.findOneByEmail(payload.email);
    if (!this.user) this.user = await this.userService.createUser(payload);
    const refreshToken: string = await this.generateRefreshToken(this.user.id);
    const accessToken: string = await this.generateAccessToken(this.user.id);
    const hashRefreshToken: string = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshTokenUser(
      this.user.id,
      hashRefreshToken,
    );
    res.cookie('token', refreshToken, {
      maxAge: 3 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });
    return {
      status: 'success',
      message: 'Sign in successfully',
      data: {
        accessToken,
      },
    };
  }

  async sendEmailForSetPassword(dto: SetPasswordDto) {
    const SALT: string = await bcrypt.genSalt(10);
    const hashedTokenPassword: string = await bcrypt.hash(dto.token, SALT);
    await this.userService.updateTokenPasswordAndExpires(
      dto.id,
      hashedTokenPassword,
      dto.expires,
    );
    await this.mailService.sendEmail(dto);
  }
}
