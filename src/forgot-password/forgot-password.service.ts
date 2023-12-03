import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SendMailDto } from '../mail/DTOs';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';
import { SendMailResponse } from './interfaces';
import * as bcrypt from 'bcrypt';
@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async forgotPassword(email: string): Promise<SendMailResponse> {
    if (!email) throw new BadRequestException(['Email is required']);
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const token: string = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000;
    const url: string = `${process.env.CLIENT_RESET_PASSWORD_ENDPOINT}?token=${token}&userid=${user.id}`;
    const SALT: string = await bcrypt.genSalt(10);
    const hashedTokken: string = await bcrypt.hash(token, SALT);
    await this.userService.updateTokenPasswordAndExpires(
      user.id,
      hashedTokken,
      expires,
    );
    const dto: SendMailDto = {
      subject: 'Reset your password',
      html: 'set-password',
      to: email,
      variable: {
        url,
        name: user.name,
        description:
          'We heard that you have forgotten the password for your account. If this is you, you can reset your password by clicking the link below.',
      },
    };
    await this.mailService.sendEmail(dto);
    return {
      status: 'success',
      message: `We sent email to ${user.email[0]}......@gmail.com for reset your password`,
    };
  }
}
