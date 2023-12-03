import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './DTOs';
import { CreateClassroomResponse } from './interface';

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
}
