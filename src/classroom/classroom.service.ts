import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './DTOs';
import {
  ClassroomCreatedResponse,
  CreateClassroomResponse,
  DetailClassroomResponse,
} from './interfaces';
import { ClassroomCreatedEntity, DetailClassroomEntity } from './entity';
import { Role } from './enums';
import { getNextUrl, getPrevUrl } from '../utils';

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
          prev: getPrevUrl(page, take),
          currentPage: page,
          next: getNextUrl(totalClassroomCreated, take, page),
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
}
