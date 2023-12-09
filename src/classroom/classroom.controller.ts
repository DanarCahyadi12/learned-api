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
  Param,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import {
  CreateAssignmentDto,
  CreateClassroomDto,
  UpdateAssignmentDto,
} from './DTOs';
import { User } from '../user/decorators';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getCurrentDate } from 'src/utils';
import { extname } from 'path';
import { UseGuards } from '@nestjs/common';
import { TeacherGuard } from './guards';

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

  @UseGuards(TeacherGuard)
  @Get('created')
  async getCreatedClassroom(
    @User() id: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('take', ParseIntPipe) take: number = 50,
  ) {
    return await this.classroomService.getCreatedClassroom(id, page, take);
  }

  @UseGuards(TeacherGuard)
  @Get('created/:id')
  async getDetailCreatedClassroom(
    @User() userID: string,
    @Param('id') classroomID: string,
  ) {
    return await this.classroomService.getDetailCreatedClassroom(
      userID,
      classroomID,
    );
  }

  @UseGuards(TeacherGuard)
  @Get('created/:id/assignments')
  async getCreatedClassroomAssignments(@Param('id') classroomID: string) {
    return await this.classroomService.getCreatedClassroomAssignments(
      classroomID,
    );
  }

  @UseGuards(TeacherGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'attachment',
        },
      ],
      {
        limits: {
          fieldSize: 1024 * 1024 * 10,
        },
        fileFilter(_, file: any, callback: any) {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf|docx|xlxs|ppt)$/)) {
            return callback(
              new BadRequestException([
                'Extension must be .png, .jpg, .jpeg, .docx, .xlsx, .ppt',
              ]),
              false,
            );
          }
          callback(null, true);
        },
      },
    ),
  )
  @Post('created/:id/assignment')
  async createAssignment(
    @Param('id') classroomID: string,
    @Body() dto: CreateAssignmentDto,
    @UploadedFiles() files: { attachment: Express.Multer.File[] },
  ) {
    return await this.classroomService.createAssignment(
      classroomID,
      files,
      dto,
    );
  }

  @UseGuards(TeacherGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'attachment',
        },
      ],
      {
        limits: {
          fieldSize: 1024 * 1024 * 10,
        },
        fileFilter(_, file: any, callback: any) {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf|docx|xlxs|ppt)$/)) {
            return callback(
              new BadRequestException([
                'Extension must be .png, .jpg, .jpeg, .docx, .xlsx, .ppt',
              ]),
              false,
            );
          }
          callback(null, true);
        },
      },
    ),
  )
  @Put('created/:id/assignment/:assignmentID')
  async updateAssignment(
    @Param('assignmentID') assignmentID: string,
    @Body() dto: UpdateAssignmentDto,
    @UploadedFiles() files: { attachment: Express.Multer.File[] },
  ) {
    return await this.classroomService.updateAssignment(
      assignmentID,
      dto,
      files,
    );
  }
}
