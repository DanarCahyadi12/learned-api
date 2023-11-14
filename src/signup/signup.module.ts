import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [SignupController],
  providers: [SignupService],
})
export class SignupModule {}
