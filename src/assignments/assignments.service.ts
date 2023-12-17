import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';
import { AssignmentEntity, AttachmentEntity } from './entity';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  DeleteAttachmentDto,
} from './DTOs';
import {
  GetAssignmentResponse,
  CreateAssignmentResponse,
  UpdateAssignmentResponse,
  GetDetailAssignmentResponse,
} from './interfaces';
import { getPrevUrl, getNextUrl } from '../utils';
import { join } from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
@Injectable()
export class AssignmentsService {
  constructor(private prismaService: PrismaService) {}

  async getAssignments(
    classroomID: string,
    page: number,
    take: number,
  ): Promise<GetAssignmentResponse> {
    try {
      const assignments: AssignmentEntity[] =
        await this.prismaService.assignments.findMany({
          skip: (page - 1) * take,
          take,
          where: {
            classroomID,
          },
          include: {
            attachments: true,
          },
        });

      const totalAssignment: number =
        await this.prismaService.assignments.count({
          where: {
            classroomID,
          },
        });
      const totalPage: number = Math.ceil(totalAssignment / take);
      return {
        status: 'success',
        message: 'Get created classroom assignments successfully',
        data: {
          totalPage,
          prev: getPrevUrl(page, take),
          currentPage: page,
          next: getNextUrl(totalPage, take, page),
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
    const attachments: AttachmentEntity[] =
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
      const assignment: AssignmentEntity =
        await this.getDetailAssignmentById(assignmentID);
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

  async getDetailAssignmentById(
    assignmentID: string,
  ): Promise<AssignmentEntity> {
    return await this.prismaService.assignments.findUnique({
      where: {
        id: assignmentID,
      },
      include: {
        attachments: true,
      },
    });
  }
}
