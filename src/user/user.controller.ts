import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entity';
import { UserPayload } from './interfaces';
import { UpdateUserDto } from './DTOs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getCurrentDate } from 'src/utils';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserPayload> {
    const user: UserEntity = await this.userService.findOneById(id);
    return {
      id: user.id,
      name: user.name,
      bio: user.bio,
      avatarURL: user.avatarURL,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('profile-picture', {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (_, file: any, callback: any) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Extension must be png, jpg, jpeg'),
            false,
          );
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './public/images/avatars',
        filename: (_, file, callback) => {
          callback(
            null,
            `${getCurrentDate()} ${Date.now()}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() picture: Express.Multer.File,
    @Body() dto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, picture?.filename, dto);
  }

  @Delete(':id/avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvatar(@Param('id') id: string) {
    await this.userService.deleteAvatar(id);
  }
}
