import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
@Injectable()
export class GoogleOauthService {
  private googleClient: any;
  constructor() {
    this.googleClient = new google.auth.OAuth2(
      process.env.MAIL_CLIENT_ID,
      process.env.MAIL_CLIENT_SECRET,
      process.env.MAIL_REDIRECT_URI,
    );
    this.googleClient.setCredentials({
      refresh_token: process.env.MAIL_REFRESH_TOKEN,
    });
  }

  async getAccessToken(): Promise<string> {
    return await this.googleClient.getAccessToken();
  }
}
