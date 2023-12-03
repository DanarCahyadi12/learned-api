import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './DTOs';
import { User } from '../user/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getCurrentDate } from 'src/utils';
import { extname } from 'path';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('banner', {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter(_, file: any, callback: any) {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException(['Extension must be png, jpg, jpeg']),
            false,
          );
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: 'public/images/banners',
        filename(_, file: any, callback: any) {
          callback(
            null,
            `${getCurrentDate()} ${Date.now()}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async createClassroom(
    @User() id: string,
    @UploadedFile() banner: Express.Multer.File,
    @Body() dto: CreateClassroomDto,
  ) {
    return await this.classroomService.createClassroom(
      id,
      banner?.filename,
      dto,
    );
  }

  @Get('created')
  async getCreatedClassroom(
    @User() id: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('take', ParseIntPipe) take: number = 50,
  ) {
    return await this.classroomService.getCreatedClassroom(id, page, take);
  }
}
