import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SignupModule } from './signup/signup.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { GoogleOauthService } from './google-oauth/google-oauth.service';
import { GoogleOauthModule } from './google-oauth/google-oauth.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        ENV === 'production' ? '.env.production' : '.env.development',
    }),
    PrismaModule,
    UserModule,
    SignupModule,
    AuthModule,
    MailModule,
    GoogleOauthModule,
  ],
  providers: [GoogleOauthService],
})
export class AppModule {}
