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
} from './interface';
import { ClassroomCreatedEntity, DetailClassroomEntity } from './entity';
import { Role } from './enums';
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
            totalClassroom: classroomsCreated.length,
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
      let detailClassroom: DetailClassroomEntity[] = await this.prismaService
        .$queryRaw`SELECT 
        classroom.*,
        (SELECT COUNT(*) FROM classroom_participants WHERE classroom_participants.classroomID = ${classroomID}) as totalParticipant,
        (SELECT COUNT(*) FROM assignments WHERE assignments.classID = ${classroomID} ) as totalAssignment,
        (SELECT COUNT(*) FROM materials WHERE materials.classroomID = ${classroomID} ) as totalMaterial,
        ((SELECT COUNT(*) FROM user_assignments WHERE user_assignments.assignmentID IN (SELECT id FROM assignments WHERE classID = ${classroomID})) / (SELECT COUNT(*) FROM classroom_participants WHERE classroom_participants.classroomID = ${classroomID}) * 100) AS totalSubmitedAssignment,
        ((SELECT COUNT(*) FROM quiz_results WHERE quiz_results.quizID IN (SELECT id FROM quiz WHERE classID = ${classroomID})) / (SELECT COUNT(*) FROM classroom_participants WHERE classroom_participants.classroomID = ${classroomID}) * 100) AS totalFinishedQuiz
      FROM classroom
      WHERE classroom.id = ${classroomID} AND classroom.userID = ${userID}`;
      if (!detailClassroom.length)
        throw new NotFoundException(['Classroom not found!']);

      //convert total field from big int to integer
      detailClassroom = detailClassroom.map((classroom) => {
        return {
          ...classroom,
          totalParticipant: Number(classroom.totalParticipant),
          totalAssignment: Number(classroom.totalAssignment),
          totalMaterial: Number(classroom.totalMaterial),
          totalSubmitedAssignment: Number(classroom.totalSubmitedAssignment),
          totalFinishedQuiz: Number(classroom.totalFinishedQuiz),
          totalQuiz: Number(classroom.totalQuiz),
        };
      });
      return {
        status: 'success',
        message: 'Get detail classroom successfully!',
        data: { ...detailClassroom[0] },
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
