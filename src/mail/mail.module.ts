import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { GoogleOauthModule } from '../google-oauth/google-oauth.module';

@Module({
  imports: [GoogleOauthModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
