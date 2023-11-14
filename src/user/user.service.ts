import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createUserDto } from './DTOs/index';
import { UserEntity } from './entity';
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(dto: createUserDto): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.prismaService.users.create({
        data: dto,
      });
      return Promise.resolve(user);
    } catch (error) {
      if (error)
        throw new InternalServerErrorException('Something bad happened', {
          cause: error,
          description: 'Something bad happened while creating a user',
        });
    }
  }

  async findOneByEmail(email: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async updateRefreshTokenUser(
    id: string,
    refreshToken: string,
  ): Promise<UserEntity> {
    try {
      return await this.prismaService.users.update({
        where: {
          id: id,
        },
        data: {
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      if (error)
        throw new InternalServerErrorException('Something bad happened', {
          cause: error,
          description:
            'Something bad happened while updating refresh token  user',
        });
    }
  }
}
