import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleOauthService } from 'src/google-oauth/google-oauth.service';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  constructor(private googleOAuthClient: GoogleOauthService) {}

  private createTransport(accessToken: string) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        accessToken: accessToken,
      },
    });
  }
  async sendEmail() {
    try {
      const data: any = await this.googleOAuthClient.getAccessToken();
      const transport = this.createTransport(data.token);
      transport.sendMail({
        from: 'official.learned@gmail.com <official.learned@gmail.com>',
        to: 'danarcahyadi21@gmail.com',
        subject: 'KONTOL',
        text: 'KONTOL BAPAK KAU',
        html: '<h1>KONTOL GEDE MEMEK TEMBEM</h1>',
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something error while sending email',
        {
          cause: error,
          description: error,
        },
      );
    }
  }
}
