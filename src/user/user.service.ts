import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createUserDto } from './DTOs/index';
import { UserEntity } from './entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  private password: string;
  async createUser(dto: createUserDto): Promise<UserEntity> {
    try {
      if (dto?.password) {
        this.password = await this.hashPassword(dto.password);
      }
      const user = await this.prismaService.users.create({
        data: { ...dto, password: this.password },
      });
      const userEntity: UserEntity = {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
      return Promise.resolve(userEntity);
    } catch (error) {
      if (error)
        throw new InternalServerErrorException('Something bad happened', {
          cause: error,
          description: 'Something bad happened while creating a user',
        });
    }
  }
  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async findOneByEmail(email: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }
}
