import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SignupModule } from './signup/signup.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { GoogleOauthModule } from './google-oauth/google-oauth.module';
import { SetPasswordModule } from './set-password/set-password.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ClassroomModule } from './classroom/classroom.module';
import { ProfileModule } from './profile/profile.module';
import { MaterialsModule } from './materials/materials.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { StoragesModule } from './storages/storages.module';

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
    SetPasswordModule,
    ForgotPasswordModule,
    ClassroomModule,
    ProfileModule,
    MaterialsModule,
    AssignmentsModule,
    StoragesModule,
  ],
})
export class AppModule {}
