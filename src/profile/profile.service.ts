import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ProfilePayload, UpdateProfileResponse } from './interfaces';
import { ProfileResponse } from './interfaces';
import { UpdateProfileDto } from './DTOs';
import { UserEntity } from '../user/entity';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ProfileService {
  private user: UserEntity;
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  async getProfile(id: string): Promise<ProfileResponse> {
    const user = await this.userService.findOneById(id);
    if (!user) throw new NotFoundException(['Profile not found!']);
    const profile: ProfilePayload = {
      id: user.id,
      name: user.name,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avatarURL: user.avatarURL,
    };

    return Promise.resolve({
      status: 'success',
      message: 'Get profile successfully',
      data: profile,
    });
  }

  async updateProfile(
    id: string,
    avatar: string | null,
    dto: UpdateProfileDto,
  ): Promise<UpdateProfileResponse> {
    try {
      const user = await this.userService.findOneById(id);
      if (!user) throw new NotFoundException(['User not found']);
      this.user = avatar
        ? await this.updateUserWithAvatar(
            id,
            `${process.env.PUBLIC_URL}/images/avatars/${avatar}`,
            dto,
          )
        : await this.updateUserWithoutAvatar(id, dto);
      return {
        status: 'success',
        message: 'Profile updated!',
        data: {
          id: this.user.id,
          name: this.user.name,
          avatarURL: this.user.avatarURL,
          bio: this.user.bio,
          createdAt: this.user.createdAt,
          updatedAt: this.user.updatedAt,
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(['Error while updating user'], {
        cause: error,
        description: error,
      });
    }
  }

  async getAvatarPath(id: string): Promise<string> {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: id,
      },
      select: {
        avatarURL: true,
      },
    });
    return this.splitAvatarUrl(user?.avatarURL);
  }

  async updateUserWithAvatar(
    id: string,
    avatar: string,
    dto: UpdateProfileDto,
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
          avatarURL: avatar,
          bio: dto.bio,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(['Error while updating user'], {
        cause: error,
        description: error,
      });
    }
  }
  async updateUserWithoutAvatar(
    id: string,
    dto: UpdateProfileDto,
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
      throw new InternalServerErrorException(['Error while updating user'], {
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
            ['Error while deleting current avatar'],
            { cause: err },
          );
        }
        console.log('AVATAR DELETED FROM PUBLIC FOLDER!');
      });
    }
  }

  async deleteAvatar(id: string) {
    const user = await this.userService.findOneById(id);
    if (!user) throw new NotFoundException(['User not found']);
    const path = await this.getAvatarPath(id);
    console.log(path);
    await this.prismaService.users.update({
      where: {
        id: id,
      },
      data: {
        avatarURL: null,
      },
    });
    this.deleteAvatarIfExits(path);
    console.log('AVATAR DELETED!');
  }
}
