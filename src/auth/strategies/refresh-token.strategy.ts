import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.['token'];
        },
      ]),
      ignoreExpiratin: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    });
  }

  validate(sub: string): string {
    return sub;
  }
}
