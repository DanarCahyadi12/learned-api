import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './DTOs';
import { Response } from 'express';
import { UserEntity } from '../user/entity';
import { SignInResponse } from './interfaces';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: AuthDto, res: Response): Promise<SignInResponse> {
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

    const response: SignInResponse = {
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
}
