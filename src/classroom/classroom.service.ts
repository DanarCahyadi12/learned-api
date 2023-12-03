import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './DTOs';
import { ClassroomCreatedResponse, CreateClassroomResponse } from './interface';
import { ClassroomEntity } from './entity';
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
      const classrooms: ClassroomEntity[] =
        await this.prismaService.classroom.findMany({
          skip: (page - 1) * take,
          take: take,
          where: {
            userID: id,
          },
        });

      const participant = (
        await this.prismaService.classroom_participants.aggregate({
          skip: (page - 1) * take,
          take: take,
          _count: {
            id: true,
          },
          where: {
            classroomID: classrooms[0].id,
          },
        })
      )._count.id;

      const response: ClassroomCreatedResponse = {
        status: 'success',
        message: 'Get created classroom successfully!',
        data: {
          totalPage: Math.ceil(classrooms.length / take),
          prev: this.getPrevUrl(page, take),
          currentPage: page,
          next: this.getNextUrl(classrooms.length, take, page),
          items: {
            totalClassroom: classrooms.length,
            totalParticipant: participant,
            classrooms,
          },
        },
      };
      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ['Error while getting created classroom'],
        { cause: error },
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
    const totalPage: number = Math.round(totalData / take);
    return page >= totalPage
      ? null
      : `${process.env.BASE_URL}/classroom/created?page=${
          page + 1
        }&take=${take}`;
  }
}
