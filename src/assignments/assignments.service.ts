import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';
import { AssignmentEntity } from './enitity';
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
      const assignments: AssignmentEntity[] = await this.getCreatedAssignments(
        classroomID,
        page,
        take,
      );
      const totalAssignment: number =
        await this.prismaService.assignments.count({
          where: {
            classroomID,
          },
        });
      return {
        status: 'success',
        message: 'Get created classroom assignments successfully',
        data: {
          totalPage: Math.ceil(totalAssignment / take),
          prev: getPrevUrl(page, take),
          currentPage: page,
          next: getNextUrl(assignments.length, take, page),
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
  async getCreatedAssignments(
    classroomID: string,
    page: number,
    take: number,
  ): Promise<AssignmentEntity[]> {
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
      return assignments;
    } catch (error) {
      throw error;
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
        );
        this.moveAttachment(attachment, destinationPath);
        const attachmentURL: string = `${
          process.env.STORAGE_URL
        }/teacher/attachments/${time.toString()}/${attachment.originalname}`;
        attachmentsData.push({
          name: attachment.originalname,
          attachmentURL,
          assignmentID,
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
  moveAttachment(attachment: Express.Multer.File, destPath: string): void {
    const bufferFile = Buffer.from(attachment.buffer);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
      fs.writeFile(`${destPath}/${attachment.originalname}`, '', (err: any) => {
        if (err) throw err;
        console.log('File created!');
      });
    }
    fs.writeFile(
      `${destPath}/${attachment.originalname}`,
      bufferFile,
      (err) => {
        if (err) throw err;
        console.log('Attachment moved!');
      },
    );
  }

  async updateAssignment(
    assignmentID: string,
    dto: UpdateAssignmentDto,
    files: { attachment: Express.Multer.File[] },
  ): Promise<UpdateAssignmentResponse> {
    console.log(files);
    const deleteAttachments: DeleteAttachmentDto[] | undefined =
      dto?.deleteAttachments;
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
      if (deleteAttachments) await this.deleteAttachments(deleteAttachments);
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
      throw new InternalServerErrorException(
        ['Error while updating assignment'],
        { cause: err, description: err },
      );
    }
  }

  async deleteAttachments(attachments: DeleteAttachmentDto[]): Promise<void> {
    const attachmentIDs: string[] = attachments.map((attachment) => {
      return attachment.id;
    });
    attachments.forEach((attachment) => {
      this.deleteAttachmentFile(attachment.url);
    });
    await this.prismaService
      .$executeRaw`DELETE FROM assignment_attachments WHERE id IN (${attachmentIDs.join(
      ',',
    )})`;
    try {
    } catch (error) {
      throw error;
    }
  }

  deleteAttachmentFile(url: string): void {
    const path: string[] = url.split('/').splice(3, url.split('/').length);
    const attachmentDir: string = join(
      __dirname,
      '..',
      '..',
      'storages',
      'teacher',
      'attachments',
      path[3],
    );
    const attachmentPath: string = join(__dirname, '..', '..', ...path);
    try {
      if (fs.existsSync(attachmentDir)) {
        fs.rm(attachmentPath, (err) => {
          if (err) throw err;
          console.log('Attachment file deleted');
          fs.rmdir(attachmentDir, (err) => {
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
