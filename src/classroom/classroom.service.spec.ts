import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomService } from './classroom.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import {
  ClassroomCreatedEntity,
  ClassroomEntity,
  ClassroomParticipantEntity,
  DetailClassroomEntity,
} from './entity';
import { CreateClassroomDto } from './DTOs';
import {
  ClassroomCreatedResponse,
  CreateClassroomResponse,
  DetailClassroomResponse,
} from './interfaces';

import { Role } from './enums';
describe('ClassroomService', () => {
  let service: ClassroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        ClassroomService,
        {
          provide: PrismaMock,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ClassroomService>(ClassroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a classroom (with banner image)', async () => {
    const dto: CreateClassroomDto = {
      name: 'Pemrograman Berorientasi Object',
      description: 'Selamat datang di course PBO!',
    };

    const classroomMock: ClassroomEntity = {
      id: 'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      code: 'XC9SKG',
      name: 'Pemrograman Berorientasi Objek',
      description: 'Selamat datang di course PBO',
      bannerURL: 'http://localhost:3000/public/images/banners/banner.png',
      createdAt: new Date(),
      updatedAt: new Date(),
      userID: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
    };
    const expectedResult: CreateClassroomResponse = {
      status: 'success',
      message: 'Classroom created!',
      data: {
        id: 'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      },
    };
    (prismaMock.classroom.create as jest.Mock).mockResolvedValue(classroomMock);
    const response: CreateClassroomResponse = await service.createClassroom(
      'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      'banner.png',
      dto,
    );
    expect(response).toEqual(expectedResult);
  });
  it('Should create a classroom (without banner image)', async () => {
    const dto: CreateClassroomDto = {
      name: 'Pemrograman Berorientasi Object',
      description: 'Selamat datang di course PBO!',
    };

    const classroomMock: ClassroomEntity = {
      id: 'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      code: 'XC9SKG',
      name: 'Pemrograman Berorientasi Objek',
      description: 'Selamat datang di course PBO',
      bannerURL: 'http://localhost:3000/public/images/banners/default.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
      userID: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
    };
    const expectedResult: CreateClassroomResponse = {
      status: 'success',
      message: 'Classroom created!',
      data: {
        id: 'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      },
    };

    const classroomParticipantMock: ClassroomParticipantEntity = {
      id: '5066bfa9-f665-4b32-b64a-37662de1fce9',
      pin: false,
      userID: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      classroomID: 'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      joinedAt: new Date(),
      role: Role.TEACHER,
    };
    (prismaMock.classroom.create as jest.Mock).mockResolvedValue(classroomMock);
    (prismaMock.classroom_participants.create as jest.Mock).mockResolvedValue(
      classroomParticipantMock,
    );
    const response: CreateClassroomResponse = await service.createClassroom(
      'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      null,
      dto,
    );
    expect(response).toEqual(expectedResult);
  });

  it('Should return created classrooms', async () => {
    const classroomsCreatedMock: ClassroomCreatedEntity[] = [
      {
        id: 'a26de271-3477-41bb-a58a-a9108019b13f',
        code: 'PNBY2',
        name: 'PWPB',
        bannerURL: 'http://localhost:3000/public/images/banners/default.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        totalParticipant: 1,
      },
      {
        id: 'eb3f5810-65d1-41b4-beb4-872b19aadc3c',
        code: 'PLO0A',
        name: 'PBO',
        bannerURL: 'http://localhost:3000/public/images/banners/default.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        totalParticipant: 1,
      },
    ];
    (prismaMock.$queryRaw as jest.Mock).mockResolvedValue(
      classroomsCreatedMock,
    );
    (prismaMock.classroom.count as jest.Mock).mockResolvedValue(2);
    const expectedResponse: ClassroomCreatedResponse = {
      status: 'success',
      message: 'Get created classroom successfully!',
      data: {
        totalPage: 1,
        next: null,
        currentPage: 1,
        prev: null,
        items: {
          totalClassroom: 2,
          classrooms: classroomsCreatedMock,
        },
      },
    };

    const response: ClassroomCreatedResponse =
      await service.getCreatedClassroom(
        '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
        1,
        50,
      );
    expect(response).toEqual(expectedResponse);
  });

  it('Should return a detail created classroom', async () => {
    const dataMock: DetailClassroomEntity = {
      id: 'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
      code: 'X7BCS',
      name: 'Bahasa Indonesia',
      description: 'Selamat datang di course BHS Indo!',
      bannerURL: 'http://localhost:3000/public/images/banners/default.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
      userID: 'b21491b5-9b9a-4d5f-82f7-9e6f07004525',
      totalParticipant: 1,
      totalAssignment: 1,
      totalMaterial: 1,
      totalQuiz: 0,
      totalSubmitedAssignment: 0,
      totalFinishedQuiz: 0,
    };
    (prismaMock.$queryRaw as jest.Mock).mockResolvedValue(dataMock);
    const expectedResponse: DetailClassroomResponse = {
      status: 'success',
      message: 'Get detail classroom successfully!',
      data: dataMock,
    };

    const result = await service.getDetailCreatedClassroom(
      'b21491b5-9b9a-4d5f-82f7-9e6f07004525',
      'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
    );

    expect(result).toEqual(expectedResponse);
  });
});
