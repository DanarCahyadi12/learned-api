import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAssignmentDto,
  CreateClassroomDto,
  DeleteAttachmentDto,
  UpdateAssignmentDto,
} from './DTOs';
import {
  ClassroomCreatedResponse,
  CreateAssignmentResponse,
  CreateClassroomResponse,
  DetailClassroomResponse,
  UpdateCreatedAssignmentResponse,
} from './interface';
import {
  AssignmentEntity,
  ClassroomCreatedEntity,
  DetailClassroomEntity,
} from './entity';
import { Role } from './enums';
import { CreatedAssignmentResponse } from './interface';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ClassroomService {
  private banner: string;
  constructor(private prismaService: PrismaService) {}

  async createClassroom(
    id: string,
    banner: string,
    dto: CreateClassroomDto,
  ): Promise<CreateClassroomResponse> {
    try {
      const code: string = this.generateCode();
      this.banner = banner
        ? `${process.env.PUBLIC_URL}/images/banners/${banner}`
        : `${process.env.PUBLIC_URL}/images/banners/default.jpg`;
      const classroom = await this.prismaService.classroom.create({
        data: {
          name: dto.name,
          description: dto.description,
          userID: id,
          bannerURL: this.banner,
          code,
        },
      });

      await this.prismaService.classroom_participants.create({
        data: {
          classroomID: classroom.id,
          userID: id,
          role: Role.TEACHER,
        },
      });

      return {
        status: 'success',
        message: 'Classroom created!',
        data: {
          id: classroom.id,
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ['Error while creating classroom'],
        { cause: error },
      );
    }
  }

  generateCode(): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result: string = '';
    for (let i = 1; i <= 5; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
  }

  async getCreatedClassroom(
    id: string,
    page: number,
    take: number,
  ): Promise<ClassroomCreatedResponse> {
    try {
      const offset: number = Math.ceil((page - 1) * take);

      const classroomsCreated: ClassroomCreatedEntity[] = await this
        .prismaService.$queryRaw`SELECT
        CAST(COUNT(*) AS CHAR) AS totalParticipant,
        classroom.id,
        classroom.code,
        classroom.name,
        classroom.description,
        classroom.bannerURL,
        classroom.createdAt,
        classroom.updatedAt
        FROM classroom_participants
        INNER JOIN classroom ON classroom.id = classroom_participants.classroomID
        WHERE classroom_participants.userID = ${id} AND classroom_participants.role = 'TEACHER'
        GROUP BY classroom_participants.classroomID
        LIMIT ${take}
        OFFSET ${offset}`;
      const totalClassroomCreated: number =
        await this.prismaService.classroom.count({
          where: {
            userID: id,
          },
        });
      const response: ClassroomCreatedResponse = {
        status: 'success',
        message: 'Get created classroom successfully!',
        data: {
          totalPage: Math.ceil(totalClassroomCreated / take),
          prev: this.getPrevUrl(page, take),
          currentPage: page,
          next: this.getNextUrl(totalClassroomCreated, take, page),
          items: {
            totalClassroom: totalClassroomCreated,
            classrooms: classroomsCreated,
          },
        },
      };
      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ['Error while getting created classroom'],
        { cause: error, description: error },
      );
    }
  }

  getPrevUrl(page: number, take: number): string {
    return page > 1
      ? `${process.env.BASE_URL}/classroom/created?page=${
          page - 1
        }&take=${take}`
      : null;
  }

  getNextUrl(totalData: number, take: number, page: number): string {
    const totalPage: number = Math.ceil(totalData / take);
    return page >= totalPage
      ? null
      : `${process.env.BASE_URL}/classroom/created?page=${
          page + 1
        }&take=${take}`;
  }

  async getDetailCreatedClassroom(
    userID: string,
    classroomID: string,
  ): Promise<DetailClassroomResponse> {
    try {
      let detailClassroom: DetailClassroomEntity = await this.prismaService
        .$queryRaw`SELECT 
        classroom.*,
        (SELECT COUNT(*) FROM classroom_participants WHERE classroom_participants.classroomID = ${classroomID}) as totalParticipant,
        (SELECT COUNT(*) FROM quiz WHERE quiz.classroomID = classroom.id) as totalQuiz,
        (SELECT COUNT(*) FROM assignments WHERE assignments.classroomID = ${classroomID} ) as totalAssignment,
        (SELECT COUNT(*) FROM materials WHERE materials.classroomID = ${classroomID} ) as totalMaterial,
        ((SELECT COUNT(*) FROM user_assignments WHERE user_assignments.assignmentID IN (SELECT id FROM assignments WHERE classroomID = ${classroomID})) / (SELECT COUNT(*) FROM classroom_participants WHERE classroom_participants.classroomID = ${classroomID}) * 100) AS totalSubmitedAssignment,
        ((SELECT COUNT(*) FROM quiz_results WHERE quiz_results.quizID IN (SELECT id FROM quiz WHERE classroomID = ${classroomID})) / (SELECT COUNT(*) FROM classroom_participants WHERE classroom_participants.classroomID = ${classroomID}) * 100) AS totalFinishedQuiz
      FROM classroom
      WHERE classroom.id = ${classroomID} AND classroom.userID = ${userID}`;
      console.log(detailClassroom);
      if (!detailClassroom)
        throw new NotFoundException(['Classroom not found!']);

      //convert total field from big int to integer
      detailClassroom = {
        ...detailClassroom,
        totalParticipant: Number(detailClassroom.totalParticipant),
        totalAssignment: Number(detailClassroom.totalAssignment),
        totalMaterial: Number(detailClassroom.totalMaterial),
        totalSubmitedAssignment: Number(
          detailClassroom.totalSubmitedAssignment,
        ),
        totalFinishedQuiz: Number(detailClassroom.totalFinishedQuiz),
        totalQuiz: Number(detailClassroom.totalQuiz),
      };
      return {
        status: 'success',
        message: 'Get detail classroom successfully!',
        data: { ...detailClassroom },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        ['Something error while get detail classroom'],
        { cause: error, description: error },
      );
    }
  }

  async getCreatedClassroomAssignments(
    classroomID: string,
    page: number,
    take: number,
  ): Promise<CreatedAssignmentResponse> {
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
          prev: this.getPrevUrl(page, take),
          currentPage: page,
          next: this.getNextUrl(assignments.length, take, page),
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
  ): Promise<UpdateCreatedAssignmentResponse> {
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
}
