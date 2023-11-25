import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpDto } from './DTOs';
import { UserEntity } from '../user/entity';
import * as bcrypt from 'bcrypt';
import { SignUpResponse } from './interfaces';
@Injectable()
export class SignupService {
  constructor(private readonly userService: UserService) {}

  async signUp(dto: SignUpDto): Promise<SignUpResponse> {
    try {
      const userExits = await this.userService.findOneByEmail(dto.email);
      if (userExits)
        throw new BadRequestException(['Email already registered']);

      const payload = {
        ...dto,
        password: await this.hashPassword(dto.password),
      };
      const user: UserEntity = await this.userService.createUser(payload);

      return Promise.resolve({
        status: 'success',
        message: 'Sign up successfully',
        data: {
          id: user.id,
        },
      });
    } catch (error) {
      if (error) throw error;
    }
  }
  private async hashPassword(password: string) {
    const SALT = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, SALT);
  }
}
