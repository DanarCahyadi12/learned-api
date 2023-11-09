import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        ENV === 'production' ? '.env.production' : '.env.development',
    }),
  ],
})
export class AppModule {}
