import { BadRequestException, Injectable } from '@nestjs/common';
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
} from './interfaces';
import { getPrevUrl, getNextUrl } from '../utils';
import { join } from 'path';
import * as fs from 'fs';
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
      console.log(totalAssignment);
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
      if (files.attachment) await this.createAttachments(files, assignmentID);
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
        const time = new Date().getTime();
        const destinationPath = join(
          __dirname,
          '..',
          '..',
          'storages',
          'teacher',
          'attachments',
          time.toString(),
          attachment.originalname,
        );
        this.moveAttachment(attachment.buffer, destinationPath);
        const attachmentURL: string = `${
          process.env.BASE_URL
        }/storages/teacher/attachments/${time.toString()}/${
          attachment.originalname
        }`;
        attachmentsData.push({
          name: attachment.originalname,
          attachmentURL,
          assignmentID,
          path: `${destinationPath}`,
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
  moveAttachment(buffer: Buffer, destPath: string): void {
    const bufferFile = Buffer.from(buffer);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
      fs.writeFile(`${destPath}`, '', (err: any) => {
        if (err) throw err;
        console.log('File created!');
      });
    }
    fs.writeFile(`${destPath}`, bufferFile, (err) => {
      if (err) throw err;
      console.log('Attachment moved!');
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
    console.log(attachmentIDs);
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
}
