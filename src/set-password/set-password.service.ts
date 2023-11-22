import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SetPasswordDto } from './DTOs';
import { SetPasswordResponse } from './interfaces';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SetPasswordService {
  constructor(private readonly userService: UserService) {}

  async setPassword(
    userID: string,
    dto: SetPasswordDto,
  ): Promise<SetPasswordResponse> {
    if (dto.password.length < 8)
      throw new BadRequestException(
        'Password and confirm password are incorrect',
      );
    if (dto.password !== dto.passwordConfirm)
      throw new BadRequestException(
        'Password and confirm password are incorrect',
      );
    const SALT = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(dto.password, SALT);
    await this.userService.updateUserPasswordById(userID, hashedPassword);
    await this.userService.updateTokenPasswordAndExpires(userID, null, null);
    return {
      status: 'success',
      message: 'Your password has been updated successfully',
    };
  }
}
