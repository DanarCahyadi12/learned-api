import {
  Controller,
  Get,
  Put,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Body,
  HttpCode,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { User } from '../user/decorators';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getCurrentDate } from '../utils';
import { extname } from 'path';
import { UpdateProfileDto } from './DTOs';
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Get()
  async getProfile(@User() id: string) {
    return await this.profileService.getProfile(id);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (_, file: any, callback: any) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException(['Extension must be png, jpg, jpeg']),
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
  async updateProfile(
    @User() id: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.profileService.updateProfile(id, avatar?.filename, dto);
  }
  @Delete('avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvatar(@User() id: string) {
    await this.profileService.deleteAvatar(id);
  }
}
