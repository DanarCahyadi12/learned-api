import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';
import {
  AssignmentEntity,
  AssignmentAttachmentEntity,
  StudentAssignmentEntity,
} from './entity';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  DeleteAttachmentDto,
  PostStudentAssignmentDto,
} from './DTOs';
import {
  GetAssignmentResponse,
  CreateAssignmentResponse,
  UpdateAssignmentResponse,
  GetDetailAssignmentResponse,
  PostStudentAssignmentResponse,
  GetListStudentAssignmentResponse,
} from './interfaces';
import { getPrevUrl, getNextUrl } from '../utils';
import { join } from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { ListStudentAssignments } from './entity/list-student-assignments.entity';
@Injectable()
export class AssignmentsService {
  constructor(private prismaService: PrismaService) {}

  async getAssignments(
    classroomID: string,
    page: number,
    take: number,
  ): Promise<GetAssignmentResponse> {
    try {
      await this.updateOpenedAssignment();
      const assignments: AssignmentEntity[] = await this.findManyByClassroomID(
        classroomID,
        take,
        page,
      );
      const totalAssignment: number =
        await this.prismaService.assignments.count({
          where: {
            classroomID,
          },
        });
      const totalPage: number = Math.ceil(totalAssignment / take);
      return {
        status: 'success',
        message: 'Get classroom assignments successfully',
        data: {
          totalPage,
          prev: getPrevUrl(page, take, `classroom/${classroomID}/assignments`),
          currentPage: page,
          next: getNextUrl(
            totalPage,
            take,
            page,
            `classroom/${classroomID}/assignments`,
          ),
          items: {
            totalAssignment,
            assignments,
          },
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ['Error while get created classroom assignments'],
        { cause: error, description: error },
      );
    }
  }
  async findManyByClassroomID(
    classroomID: string,
    take: number,
    page: number,
  ): Promise<AssignmentEntity[]> {
    return await this.prismaService.assignments.findMany({
      skip: (page - 1) * take,
      take,
      where: {
        classroomID,
      },
      include: {
        attachments: true,
      },
    });
  }
  async createAssignment(
    classroomID: string,
    files: { attachment: Express.Multer.File[] },
    dto: CreateAssignmentDto,
  ): Promise<CreateAssignmentResponse> {
    const extensions = dto.extensions.join(',');
    try {
      const assignmentID: string = (
        await this.prismaService.assignments.create({
          data: {
            ...dto,
            classroomID,
            extensions,
          },
          select: {
            id: true,
          },
        })
      ).id;

      if (files?.attachment) await this.createAttachments(files, assignmentID);
      return {
        status: 'success',
        message: 'Assignment created!',
        data: {
          id: assignmentID,
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ['Error while creating assignment'],
        { cause: error, description: error },
      );
    }
  }
  async createAttachments(
    files: { attachment: Express.Multer.File[] },
    assignmentID: string,
  ) {
    const attachmentsData = [];

    try {
      files.attachment.forEach((attachment) => {
        const randomFolderName: string = crypto.randomBytes(16).toString('hex');
        const destinationPath = join(
          __dirname,
          '..',
          '..',
          'storages',
          'teacher',
          'attachments',
          randomFolderName,
        );
        this.moveAttachment(
          attachment.buffer,
          destinationPath,
          attachment.originalname,
        );
        const attachmentURL: string = `${process.env.BASE_URL}/storages/teacher/attachments/${randomFolderName}/${attachment.originalname}`;
        attachmentsData.push({
          name: attachment.originalname,
          attachmentURL,
          assignmentID,
          path: `${destinationPath}\\${attachment.originalname}`,
        });
      });
      await this.prismaService.assignment_attachments.createMany({
        data: attachmentsData,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  moveAttachment(buffer: Buffer, destPath: string, filename: string): void {
    fs.mkdir(`${destPath}`, (err) => {
      if (err) throw err;
      console.log('Directory created');
      fs.writeFile(`${destPath}\\${filename}`, buffer, (err: any) => {
        if (err) throw err;
        console.log('File created!');
      });
    });
  }

  async updateAssignment(
    assignmentID: string,
    dto: UpdateAssignmentDto,
    files: { attachment: Express.Multer.File[] },
  ): Promise<UpdateAssignmentResponse> {
    const assignmentDto = {
      title: dto.title,
      description: dto.description,
      openedAt: dto.openedAt,
      closedAt: dto.closedAt,
      allowSeeGrade: dto.allowSeeGrade,
      extensions: dto.extensions,
      passGrade: dto.passGrade,
    };
    try {
      if (dto?.deleteAttachments)
        await this.deleteAttachments(dto.deleteAttachments, assignmentID);
      const assignmentId: string = (
        await this.prismaService.assignments.update({
          where: {
            id: assignmentID,
          },
          data: {
            ...assignmentDto,
            extensions: dto.extensions.join(','),
          },
          select: {
            id: true,
          },
        })
      ).id;
      if (files?.attachment) await this.createAttachments(files, assignmentID);
      return {
        status: 'success',
        message: 'Assignment successfully updated',
        data: {
          id: assignmentId,
        },
      };
    } catch (err) {
      console.log(err);
      if (err?.meta?.cause === 'Record to update not found.')
        throw new BadRequestException(['Assignment or attachments not found']);
      throw new InternalServerErrorException(
        ['Error while updating assignment'],
        { cause: err, description: err },
      );
    }
  }

  async deleteAttachments(
    dto: DeleteAttachmentDto[],
    assignmentID: string,
  ): Promise<void> {
    const attachmentIDs: string[] = dto.map((attachment) => {
      return attachment.id;
    });
    const attachments: AssignmentAttachmentEntity[] =
      await this.prismaService.assignment_attachments.findMany({
        where: {
          AND: {
            assignmentID: assignmentID,
          },
          id: {
            in: [...attachmentIDs],
          },
        },
      });
    if (attachments?.length) {
      attachments.forEach((attachment) => {
        this.deleteAttachmentFile(attachment.path);
      });
    }
    await this.prismaService.assignment_attachments.deleteMany({
      where: {
        AND: {
          assignmentID,
        },
        id: {
          in: [...attachmentIDs],
        },
      },
    });

    try {
    } catch (error) {
      throw error;
    }
  }

  deleteAttachmentFile(path: string): void {
    try {
      if (fs.existsSync(path)) {
        fs.rm(path, (err) => {
          if (err) throw err;
          console.log('Attachment file deleted');
          const dir: string = path
            .split('\\')
            .splice(0, path.split('\\').length - 1)
            .join('\\');
          fs.rmdir(dir, (err) => {
            if (err) throw err;
            console.log('Attachment folder deleted!');
          });
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getDetailAssignment(
    assignmentID: string,
  ): Promise<GetDetailAssignmentResponse> {
    try {
      const assignment: AssignmentEntity = await this.findOneById(assignmentID);
      if (!assignment) throw new NotFoundException(['Assignment not found']);
      return {
        status: 'success',
        message: 'Get detail assignment successfully',
        data: assignment,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
      throw new InternalServerErrorException(
        ['Error while getting assignment'],
        { cause: error, description: error },
      );
    }
  }

  async findOneById(assignmentID: string): Promise<AssignmentEntity> {
    return await this.prismaService.assignments.findUnique({
      where: {
        id: assignmentID,
      },
      include: {
        attachments: true,
      },
    });
  }

  async updateOpenedAssignment(): Promise<void> {
    await this.prismaService.assignments.updateMany({
      where: {
        openedAt: {
          lte: new Date(),
        },
      },
      data: {
        isOpen: true,
      },
    });
  }

  async postStudentAssignment(
    assignmentID: string,
    userID: string,
    dto: PostStudentAssignmentDto[],
    files: Express.Multer.File[],
  ): Promise<PostStudentAssignmentResponse> {
    try {
      const assignment: AssignmentEntity = await this.findOneById(assignmentID);
      const isAssignmentAlreadySubmited =
        await this.prismaService.student_assignments.findFirst({
          where: {
            userID: userID,
          },
          select: {
            id: true,
          },
        });
      if (isAssignmentAlreadySubmited)
        throw new BadRequestException([
          'You are already submited this assignment',
        ]);
      if (!assignment) throw new NotFoundException(['Assignment not found']);
      if (!dto && !files)
        throw new BadRequestException(['Assignment is required']);
      let isOverdue: boolean = null;
      if (!assignment.dueAt) isOverdue = false;
      if (assignment.dueAt && assignment.dueAt <= new Date()) isOverdue = true;
      if (assignment.dueAt && assignment.dueAt >= new Date()) isOverdue = false;
      const studentAssignmentID: string = (
        await this.createStudentAssignment(assignmentID, userID, isOverdue)
      ).id;

      if (files)
        await this.createStudentAssignmentFiles(studentAssignmentID, files);
      if (dto.length)
        await this.createStudentAssignmentTypeURL(studentAssignmentID, dto);
      return {
        status: 'success',
        message: 'Assignment successfully posted',
        data: {
          id: studentAssignmentID,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createStudentAssignment(
    assignmentID: string,
    userID: string,
    overdue: boolean,
  ): Promise<StudentAssignmentEntity> {
    return await this.prismaService.student_assignments.create({
      data: {
        assignmentID,
        userID,
        overdue,
      },
    });
  }

  async createStudentAssignmentFiles(
    studentAssignmentID: string,
    materialFiles: Express.Multer.File[],
  ): Promise<void> {
    const data = [];
    try {
      materialFiles.forEach((materialFile) => {
        const randomFolderName: string = crypto.randomBytes(16).toString('hex');
        const dir: string = join(
          __dirname,
          '..',
          '..',
          'storages',
          'student',
          'assignments',
          randomFolderName,
        );
        this.moveUserAssignmentFiles(
          materialFile.buffer,
          dir,
          materialFile.originalname,
        );
        data.push({
          type: 'FILE',
          studentAssignmentID,
          attachmentPath: `${dir}\\${materialFile.originalname}`,
          attachmentURL: `${process.env.BASE_URL}/storages/student/assignments/${randomFolderName}/${materialFile.originalname}`,
        });
      });
      console.log(data);
      await this.prismaService.student_assignment_attachments.createMany({
        data: data,
      });
    } catch (error) {
      throw error;
    }
  }

  moveUserAssignmentFiles(buffer: Buffer, dir: string, filename: string): void {
    fs.mkdir(dir, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
      fs.writeFile(`${dir}\\${filename}`, buffer, (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
      });
    });
  }

  async createStudentAssignmentTypeURL(
    studentAssignmentID: string,
    DTOs: PostStudentAssignmentDto[],
  ): Promise<void> {
    try {
      const data = [];
      DTOs.forEach((dto) => {
        data.push({
          type: 'URL',
          attachmentURL: dto.url,
          studentAssignmentID,
        });
      });
      await this.prismaService.student_assignment_attachments.createMany({
        data: data,
      });
    } catch (error) {
      throw error;
    }
  }

  async getListStudentAssignments(
    assignmentID: string,
    page: number,
    take: number,
  ): Promise<GetListStudentAssignmentResponse> {
    try {
      const isExitsAssignment = await this.findOneById(assignmentID);
      if (!isExitsAssignment)
        throw new NotFoundException(['Assignnment not found!']);
      const listAssignments: ListStudentAssignments[] =
        await this.findListStudentAssignments(assignmentID, page, take);
      const totalListAssignment: number =
        await this.prismaService.student_assignments.count({
          where: {
            assignmentID,
          },
        });
      const totalPage: number = Math.ceil(totalListAssignment / take);
      const prevURL: string = getPrevUrl(
        page,
        take,
        `classroom/${isExitsAssignment.classroomID}/list/student/assignments/${assignmentID}}`,
      );
      const nextURL: string = getNextUrl(
        totalPage,
        take,
        page,
        `classroom/${isExitsAssignment.classroomID}/list/student/assignments/${assignmentID}}`,
      );
      return {
        status: 'success',
        message: 'Get list of student assignments successfully',
        data: {
          totalPage,
          prev: prevURL,
          currentPage: page,
          next: nextURL,
          items: {
            totalAssignment: totalListAssignment,
            assignments: listAssignments,
          },
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findListStudentAssignments(
    assignmentID: string,
    page: number,
    take: number,
  ): Promise<ListStudentAssignments[]> {
    try {
      return await this.prismaService.student_assignments.findMany({
        skip: (page - 1) * take,
        take: take,
        where: {
          assignmentID,
        },
        select: {
          id: true,

          submitedAt: true,
          overdue: true,
          users: {
            select: {
              id: true,
              name: true,
              avatarURL: true,
            },
          },
          studentAttachments: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
