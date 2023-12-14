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
import { CreateClassroomDto } from './DTOs';
import { CreateAssignmentDto, UpdateAssignmentDto } from '../assignments/DTOs';
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
import { CreateMaterialDto } from '../materials/DTOs';
import { AssignmentsService } from '../assignments/assignments.service';
import { MaterialsService } from '../materials/materials.service';

@Controller('classroom')
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly assignmentsService: AssignmentsService,
    private readonly materialsService: MaterialsService,
  ) {}

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
    return await this.assignmentsService.createAssignment(
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
    return await this.assignmentsService.updateAssignment(
      assignmentID,
      dto,
      files,
    );
  }

  @UseGuards(TeacherGuard)
  @Get('created/:id/assignments')
  async getCreatedAssignments(
    @Param('id') classroomID: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('take', ParseIntPipe) take: number = 50,
  ) {
    const result = await this.assignmentsService.getAssignments(
      classroomID,
      page,
      take,
    );
    return result;
  }

  @UseGuards(TeacherGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'materials',
        },
      ],
      {
        limits: {
          fileSize: 1024 * 1024 * 10,
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
  @Post('created/:id/materials')
  async createMaterial(
    @Param('id') classroomID: string,
    @Body() dto: CreateMaterialDto,
    @UploadedFiles() files: { materials: Express.Multer.File[] },
  ) {
    console.log(files);
    return await this.materialsService.createMaterials(
      classroomID,
      dto,
      files?.materials,
    );
  }

  @UseGuards(TeacherGuard)
  @Get('created/:id/materials')
  async getMaterials(
    @Param('id') classroomID: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('take', ParseIntPipe) take: number = 50,
  ) {
    return await this.materialsService.getMaterials(classroomID, page, take);
  }
}
