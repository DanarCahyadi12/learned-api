import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as ncp from 'ncp';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const sourcePath = path.join(__dirname, '..', 'src', 'mail', 'templates');
  const destinationPath = path.join(__dirname, 'mail', 'templates');
  ncp.ncp(sourcePath, destinationPath, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Templates copied successfully!');
  });
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
