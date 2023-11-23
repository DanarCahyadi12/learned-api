import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, createUserDto } from './DTOs/index';
import { UserEntity } from './entity';
import { UpdateUserResponse } from './interfaces';

@Injectable()
export class UserService {
  private pictureURL: string;
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
        description: 'Something bad happened while finding a user',
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

  async updateUserPasswordById(id: string, password: string) {
    try {
      return await this.prismaService.users.update({
        where: {
          id: id,
        },
        data: {
          password: password,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error while updating password', {
        cause: error,
        description: error,
      });
    }
  }
  async updateUser(
    id: string,
    picture: string,
    dto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    try {
      this.pictureURL = picture
        ? `${process.env.PUBLIC_URL}/images/profile-picture/${picture}`
        : null;
      const user: UserEntity = await this.prismaService.users.update({
        where: {
          id: id,
        },
        data: {
          name: dto.name,
          pictureURL: this.pictureURL,
          bio: dto.bio,
        },
      });

      return {
        status: 'success',
        message: 'User updated successfully',
        data: {
          id: user.id,
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error while updating user', {
        cause: error,
        description: error,
      });
    }
  }
}
