import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as path from 'path';
import { copyIntoDistFolder } from './utils';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('/public', express.static(path.join(__dirname, '..', 'public')));
  app.useGlobalPipes(new ValidationPipe());
  copyIntoDistFolder();
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
