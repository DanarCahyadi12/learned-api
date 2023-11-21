import { Module } from '@nestjs/common';
import { SetPasswordService } from './set-password.service';
import { SetPasswordController } from './set-password.controller';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MailModule, UserModule],
  controllers: [SetPasswordController],
  providers: [SetPasswordService],
  exports: [SetPasswordService],
})
export class SetPasswordModule {}
