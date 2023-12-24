import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomService } from './classroom.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import {
  ClassroomCreatedEntity,
  ClassroomEntity,
  ClassroomParticipantEntity,
} from './entity';
import { ClassroomDto, JoinClassroomDto } from './DTOs';
import {
  ClassroomCreatedResponse,
  CreateClassroomResponse,
  DetailClassroomResponse,
  JoinClassroomResponse,
} from './interfaces';

import { Role } from './enums';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ClassroomService', () => {
  let service: ClassroomService;
  const classroomParticipantMock: ClassroomParticipantEntity = {
    id: '5066bfa9-f665-4b32-b64a-37662de1fce9',
    pin: false,
    userID: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
    classroomID: 'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
    joinedAt: new Date(),
    role: Role.TEACHER,
  };
  const classroomsParticipantStudentMock: ClassroomParticipantEntity[] = [
    {
      id: '5066bfa9-f665-4b32-b64a-37662de1fce9',
      pin: false,
      userID: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      classroomID: 'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      joinedAt: new Date(),
      role: Role.STUDENT,
    },
    {
      id: '5066bfa9-f665-4b32-b64a-37662de1fce9',
      pin: false,
      userID: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      classroomID: 'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      joinedAt: new Date(),
      role: Role.STUDENT,
    },
  ];
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
  const updateClassroomMock: ClassroomEntity = {
    id: 'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
    code: 'XC9SKG',
    name: 'Updated name',
    description: 'Updated classroom',
    bannerURL: 'http://localhost:3000/public/images/banners/banner.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    userID: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
  };
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
    const dto: ClassroomDto = {
      name: 'Pemrograman Berorientasi Object',
      description: 'Selamat datang di course PBO!',
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
    const dto: ClassroomDto = {
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
    const dataMock = {
      id: 'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
      code: 'X7BCS',
      name: 'Bahasa Indonesia',
      description: 'Selamat datang di course BHS Indo!',
      bannerURL: 'http://localhost:3000/public/images/banners/default.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
      userID: 'b21491b5-9b9a-4d5f-82f7-9e6f07004525',
      _count: { userJoined: 2, assignments: 1, materials: 2, quiz: 1 },
      assignments: [{ _count: { users: 0 } }],
      quiz: [{ _count: { quizResult: 1 } }],
    };
    (prismaMock.classroom.findUnique as jest.Mock).mockResolvedValue(dataMock);
    const expectedResponse: DetailClassroomResponse = {
      status: 'success',
      message: 'Get detail classroom successfully',
      data: {
        id: dataMock.id,
        code: dataMock.code,
        name: dataMock.name,
        description: dataMock.description,
        bannerURL: dataMock.bannerURL,
        createdAt: dataMock.createdAt,
        updatedAt: dataMock.updatedAt,
        userID: dataMock.userID,
        total: {
          participant: dataMock._count.userJoined,
          assignment: dataMock._count.assignments,
          material: dataMock._count.materials,
          quiz: dataMock._count.quiz,
          submitedAssignment: dataMock.assignments[0]._count.users,
          finishedQuiz: dataMock.quiz[0]._count.quizResult,
        },
      },
    };

    const result = await service.getDetailCreatedClassroom(
      'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
    );

    expect(result).toEqual(expectedResponse);
  });

  it('Should throw an BadRequest and NotFound exception when validating joining classroom', async () => {
    (
      prismaMock.classroom_participants.findFirst as jest.Mock
    ).mockResolvedValue(classroomParticipantMock);
    expect(
      async () =>
        await service.validateJoinClassroom(
          '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
          'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
          classroomMock,
        ),
    ).rejects.toThrow(BadRequestException);
    expect(
      async () =>
        await service.validateJoinClassroom(
          '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
          '0e228dc2-3766-4fd5-8880-ee059f3d6f83',
          undefined,
        ),
    ).rejects.toThrow(NotFoundException);
  });

  it('Joining classroom should successfully', async () => {
    (prismaMock.classroom.findUnique as jest.Mock).mockResolvedValue(
      classroomMock,
    );
    (
      prismaMock.classroom_participants.findFirst as jest.Mock
    ).mockResolvedValue(undefined);
    (prismaMock.classroom_participants.create as jest.Mock).mockResolvedValue(
      classroomsParticipantStudentMock[0],
    );
    const dto: JoinClassroomDto = {
      code: classroomsCreatedMock[0].code,
    };
    const expectedResult: JoinClassroomResponse = {
      status: 'success',
      message: 'Joining classroom successfully',
      data: {
        id: classroomsParticipantStudentMock[0].id,
      },
    };
    const result: JoinClassroomResponse = await service.joinClassroom(
      classroomsCreatedMock[0].id,
      '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      dto,
    );

    expect(expectedResult).toEqual(result);
  });

  it('Should retrieve clasroom participant', async () => {
    (
      prismaMock.classroom_participants.findFirst as jest.Mock
    ).mockResolvedValue(classroomParticipantMock);
    const result =
      await service.findOneClassroomParticipantByClassroomIdAndUserID(
        'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
        '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      );
    expect(result).toEqual(classroomParticipantMock);
  });

  it('Should updating classroom with banner', async () => {
    (prismaMock.classroom.update as jest.Mock).mockResolvedValue({
      ...updateClassroomMock,
      bannerURL: 'http://localhost:3000/public/images/banners/gambr1.jpg',
    });
    const dto: ClassroomDto = {
      name: 'Updated name',
      description: 'Updated classroom',
    };
    const result = await service.updateClassroom(
      'cf6e1502-01d8-4f51-901a-31b0be6a68a5',
      dto,
      'gambar1.jpg',
    );
    expect(result).toEqual({
      status: 'success',
      message: 'Classroom updated successfully',
    });
  });

  it('Should throw an NotFound Exception', async () => {
    (prismaMock.classroom.findUnique as jest.Mock).mockResolvedValue(undefined);
    const dto: ClassroomDto = {
      name: 'Updated name',
      description: 'Updated classroom',
    };
    expect(async () => {
      await service.updateClassroom('invalid id', dto, 'gambar1.jpg');
    }).rejects.toThrow(NotFoundException);
  });
});
