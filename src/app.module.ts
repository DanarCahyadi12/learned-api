import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SignupModule } from './signup/signup.module';
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
  ],
})
export class AppModule {}
