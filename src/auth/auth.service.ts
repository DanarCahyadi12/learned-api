import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './DTOs';
import { Response } from 'express';
import { UserEntity } from '../user/entity';
import { AuthResponse } from './interfaces';
import * as bcrypt from 'bcrypt';
import { GooglePayloadDto } from './DTOs/google.dto';
@Injectable()
export class AuthService {
  private user: UserEntity;
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: AuthDto, res: Response): Promise<AuthResponse> {
    if (!dto.email) throw new BadRequestException('Email is required');
    if (!dto.password) throw new BadRequestException('Password is required');

    const id: boolean | string = await this.validate(dto);
    if (!id) throw new BadRequestException('Email or password is incorrect');

    const accessToken: string = await this.generateAccessToken(id);
    const refreshToken: string = await this.generateRefreshToken(id);
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);

    await this.userService.updateRefreshTokenUser(id, hashedRefreshToken);
    res.cookie('token', refreshToken, {
      maxAge: 3 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

    const response: AuthResponse = {
      status: 'success',
      message: 'Sign in successfully',
      data: {
        accessToken,
      },
    };
    return Promise.resolve(response);
  }

  async validate(dto: AuthDto): Promise<false | string> {
    const user: UserEntity = await this.userService.findOneByEmail(dto.email);
    if (!user) return false;
    const { password } = user;
    const matchPassword = await bcrypt.compare(dto.password, password);
    if (!matchPassword) return false;
    return user.id;
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
}
