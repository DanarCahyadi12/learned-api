import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './guards';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenStrategy,
    AccessTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AuthModule {}
