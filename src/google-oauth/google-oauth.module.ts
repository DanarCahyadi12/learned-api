import { Module } from '@nestjs/common';
import { GoogleOauthService } from './google-oauth.service';

@Module({
  providers: [GoogleOauthService],
  exports: [GoogleOauthService],
})
export class GoogleOauthModule {}
