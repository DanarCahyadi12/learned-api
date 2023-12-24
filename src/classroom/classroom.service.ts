import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClassroomDto, JoinClassroomDto } from './DTOs';
import {
  ClassroomCreatedResponse,
  CreateClassroomResponse,
  DetailClassroomResponse,
  JoinClassroomResponse,
} from './interfaces';
import { ClassroomCreatedEntity, ClassroomParticipantEntity } from './entity';
import { Role } from './enums';
import { getNextUrl, getPrevUrl } from '../utils';

@Injectable()
export class ClassroomService {
  private banner: string;
  constructor(private prismaService: PrismaService) {}

  async createClassroom(
    id: string,
    banner: string,
    dto: ClassroomDto,
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
          userJoined: {
            create: {
              userID: id,
              role: Role.TEACHER,
            },
          },
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
      const totalPage: number = Math.ceil(totalClassroomCreated / take);
      const response: ClassroomCreatedResponse = {
        status: 'success',
        message: 'Get created classroom successfully!',
        data: {
          totalPage,
          prev: getPrevUrl(page, take, 'classroom/created'),
          currentPage: page,
          next: getNextUrl(totalPage, take, page, 'classroom/created'),
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
    classroomID: string,
  ): Promise<DetailClassroomResponse> {
    try {
      const detailClassroom = await this.prismaService.classroom.findUnique({
        where: {
          id: classroomID,
        },
        select: {
          _count: {
            select: {
              userJoined: true,
              assignments: true,
              materials: true,
              quiz: true,
            },
          },
          assignments: {
            select: {
              _count: {
                select: {
                  users: true,
                },
              },
            },
          },
          quiz: {
            select: {
              _count: {
                select: {
                  quizResult: true,
                },
              },
            },
          },
          id: true,
          code: true,
          name: true,
          description: true,
          bannerURL: true,
          createdAt: true,
          updatedAt: true,
          userID: true,
        },
      });
      const response: DetailClassroomResponse = {
        status: 'success',
        message: 'Get detail classroom successfully',
        data: {
          id: detailClassroom.id,
          code: detailClassroom.code,
          name: detailClassroom.name,
          description: detailClassroom.description,
          bannerURL: detailClassroom.bannerURL,
          createdAt: detailClassroom.createdAt,
          updatedAt: detailClassroom.updatedAt,
          userID: detailClassroom.userID,
          total: {
            assignment: detailClassroom._count.assignments,
            participant: detailClassroom._count.userJoined,
            material: detailClassroom._count.materials,
            quiz: detailClassroom._count.quiz,
            submitedAssignment:
              detailClassroom.assignments[0]._count?.users ?? 0,
            finishedQuiz: detailClassroom.quiz[0]._count.quizResult ?? 0,
          },
        },
      };
      if (!detailClassroom)
        throw new NotFoundException(['Classroom not found!']);
      return response;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        ['Something error while get detail classroom'],
        { cause: error, description: error },
      );
    }
  }

  async joinClassroom(
    classroomID: string,
    userID: string,
    dto: JoinClassroomDto,
  ): Promise<JoinClassroomResponse> {
    try {
      const classroom: ClassroomCreatedEntity =
        await this.prismaService.classroom.findUnique({
          where: {
            code: dto.code,
          },
        });
      await this.validateJoinClassroom(userID, classroomID, classroom);
      const classroomParticipant =
        await this.prismaService.classroom_participants.create({
          data: {
            classroomID,
            userID,
            role: Role.STUDENT,
          },
        });
      return {
        status: 'success',
        message: 'Joining classroom successfully',
        data: {
          id: classroomParticipant.id,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      console.log(error);
      throw new InternalServerErrorException(
        ['Error while joining classroom'],
        { cause: error, description: error },
      );
    }
  }

  async validateJoinClassroom(
    userID: string,
    classroomID: string,
    classroom: ClassroomCreatedEntity | undefined,
  ): Promise<void> {
    try {
      if (!classroom) throw new NotFoundException(['Classroom not found']);
      const user = await this.prismaService.classroom_participants.findFirst({
        where: {
          AND: [{ userID }, { classroomID }],
        },
      });
      if (user)
        throw new BadRequestException(['You already joined this classroom']);
    } catch (error) {
      throw error;
    }
  }

  async findOneClassroomParticipantByClassroomIdAndUserID(
    classroomID: string,
    userID: string,
  ): Promise<ClassroomParticipantEntity> {
    return await this.prismaService.classroom_participants.findFirst({
      where: {
        AND: [{ userID }, { classroomID }],
      },
    });
  }

  async updateClassroom(
    classroomID: string,
    dto: ClassroomDto,
    banner: string,
  ) {
    try {
      const isExitsClassroom = await this.prismaService.classroom.findUnique({
        where: {
          id: classroomID,
        },
        select: {
          id: true,
        },
      });
      if (!isExitsClassroom)
        throw new NotFoundException(['Classroom not found']);
      this.banner = banner
        ? `${process.env.PUBLIC_URL}/images/banners/${banner}`
        : `${process.env.PUBLIC_URL}/images/banners/default.jpg`;
      await this.prismaService.classroom.update({
        where: {
          id: classroomID,
        },
        data: {
          name: dto.name,
          description: dto.description,
          bannerURL: this.banner,
        },
      });
      return {
        status: 'success',
        message: 'Classroom updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
