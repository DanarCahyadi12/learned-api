import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        ENV === 'production' ? '.env.production' : '.env.development',
    }),
    PrismaModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
