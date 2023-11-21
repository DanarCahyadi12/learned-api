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
      console.log(error);
      throw new InternalServerErrorException('Something bad happened', {
        cause: error,
        description: 'Something bad happened while creating a user',
      });
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something bad happened', {
        cause: error,
        description: 'Something bad happened while creating a user',
      });
    }
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
      console.log(error);
      throw new InternalServerErrorException('Something bad happened', {
        cause: error,
        description: error,
      });
    }
  }

  async findOneById(id: string): Promise<UserEntity> {
    try {
      return await this.prismaService.users.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something bad happened while find user by id',
        {
          cause: error,
          description: error,
        },
      );
    }
  }

  async findOneByTokenResetPassword(token: string): Promise<UserEntity> {
    try {
      return await this.prismaService.users.findUnique({
        where: {
          tokenPassword: token,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error while find user by token password',
        {
          cause: error,
          description: error,
        },
      );
    }
  }

  async updateTokenPasswordAndExpires(
    id: string,
    token: string,
    expires: number,
  ) {
    try {
      return await this.prismaService.users.update({
        where: {
          id: id,
        },
        data: {
          tokenPassword: token,
          tokenPasswordExpires: expires,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error while updating token password',
        { cause: error, description: error },
      );
    }
  }
}
