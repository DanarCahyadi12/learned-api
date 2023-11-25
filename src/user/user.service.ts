import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, createUserDto } from './DTOs/index';
import { UserEntity } from './entity';
import { UpdateUserResponse } from './interfaces';
import * as fs from 'fs';
@Injectable()
export class UserService {
  private user: UserEntity;
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
    picture: string | null,
    dto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    if (!dto.name) throw new BadRequestException('Name is required');
    try {
      this.user = picture
        ? await this.updateUserWithAvatar(
            id,
            `${process.env.PUBLIC_URL}/images/avatars/${picture}`,
            dto,
          )
        : await this.updateUserWithoutAvatar(id, dto);
      return {
        status: 'success',
        message: 'Profile updated!',
        data: {
          id: this.user.id,
          name: this.user.name,
          pictureURL: this.user.pictureURL,
          bio: this.user.bio,
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

  async getAvatarPath(id: string): Promise<string> {
    const { pictureURL } = await this.prismaService.users.findUnique({
      where: {
        id: id,
      },
      select: {
        pictureURL: true,
      },
    });
    return this.splitAvatarUrl(pictureURL);
  }

  async updateUserWithAvatar(
    id: string,
    picture: string,
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      const path: string = await this.getAvatarPath(id);
      this.deleteAvatarIfExits(path);
      return await this.prismaService.users.update({
        where: {
          id: id,
        },
        data: {
          name: dto.name,
          pictureURL: picture,
          bio: dto.bio,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error while updating user', {
        cause: error,
        description: error,
      });
    }
  }
  async updateUserWithoutAvatar(
    id: string,
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      return await this.prismaService.users.update({
        where: {
          id: id,
        },
        data: {
          name: dto.name,
          bio: dto.bio,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error while updating user', {
        cause: error,
        description: error,
      });
    }
  }

  splitAvatarUrl(url: string): string {
    if (url && url.includes('public')) {
      return url
        .split('/')
        .splice(3, url.length - 1)
        .join('/');
    }
  }

  deleteAvatarIfExits(path: string) {
    if (fs.existsSync(`./${path}`)) {
      fs.rm(`./${path}`, (err) => {
        if (err) {
          console.log(err);
          throw new InternalServerErrorException(
            'Error while deleting current avatar',
            { cause: err },
          );
        }
      });
    }
  }
}
