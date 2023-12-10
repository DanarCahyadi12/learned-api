import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomService } from './classroom.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import {
  AssignmentEntity,
  ClassroomCreatedEntity,
  ClassroomEntity,
  ClassroomParticipantEntity,
  DetailClassroomEntity,
} from './entity';
import { CreateClassroomDto } from './DTOs';
import {
  CreatedAssignmentResponse,
  ClassroomCreatedResponse,
  CreateClassroomResponse,
  DetailClassroomResponse,
} from './interface';
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

  it('Previous url should not empty', () => {
    const expectedResult: string = `${process.env.BASE_URL}/classroom/created?page=1&take=50`;
    const result: string = service.getPrevUrl(2, 50);
    expect(result).toBe(expectedResult);
  });
  it('Previous url should empty', () => {
    const result: string = service.getPrevUrl(1, 50);
    expect(result).toBeNull();
  });
  it('Next url should not empty', () => {
    const expectedResult: string = `${process.env.BASE_URL}/classroom/created?page=2&take=50`;
    const result: string = service.getNextUrl(100, 50, 1);
    expect(result).toBe(expectedResult);
  });
  it('Next url should empty', () => {
    const result: string = service.getNextUrl(100, 70, 2);
    expect(result).toBeNull();
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

  it('Should return created classroom assigments', async () => {
    const assignmentsMock: AssignmentEntity[] = [
      {
        id: '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
        title: 'assignment 1',
        description: null,
        openedAt: new Date(),
        closedAt: null,
        passGrade: null,
        extensions: '.jpg, .png',
        allowSeeGrade: false,
        updatedAt: new Date(),
        createdAt: new Date(),
        classroomID: 'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
        attachments: [
          {
            id: '3271f3cd-dfae-4ae9-bed',
            attachmentURL:
              'http://example.com/storages/teacher/attachments/test.pdf',
            name: 'test.pdf',
            assignmentID: '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
            createdAt: new Date(),
          },
        ],
      },
      {
        id: '07177838-3ae8-4fc6-9982-623251c836b0',
        title: 'assignment 2',
        description: null,
        createdAt: new Date(),
        openedAt: new Date(),
        closedAt: null,
        passGrade: null,
        extensions: '.jpg, .png',
        allowSeeGrade: false,
        updatedAt: new Date(),
        classroomID: 'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
        attachments: [
          {
            id: '07177838-3ae8-4fc6-s5',
            attachmentURL:
              'http://example.com/storages/teacher/attachments/test.pdf',
            name: 'test.pdf',
            assignmentID: '07177838-3ae8-4fc6-9982-623251c836b0',
            createdAt: new Date(),
          },
        ],
      },
      {
        id: 'b31e3a8e-89d2-462e-9e4d-8bb4b04d634d',
        title: 'assignment 3',
        description: null,
        createdAt: new Date(),
        openedAt: new Date(),
        closedAt: null,
        passGrade: null,
        extensions: '.jpg, .png',
        allowSeeGrade: false,
        updatedAt: new Date(),
        classroomID: 'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
        attachments: [
          {
            id: '07177838-3ae8-4fc6-s5-90sh',
            attachmentURL:
              'http://example.com/storages/teacher/attachments/test.pdf',
            name: 'test.pdf',
            assignmentID: 'b31e3a8e-89d2-462e-9e4d-8bb4b04d634d',
            createdAt: new Date(),
          },
        ],
      },
    ];

    (prismaMock.assignments.findMany as jest.Mock).mockResolvedValue(
      assignmentsMock,
    );
    const resultExpected: CreatedAssignmentResponse = {
      status: 'success',
      message: 'Get created classroom assignments successfully',
      data: {
        totalPage: 1,
        prev: null,
        currentPage: 1,
        next: null,
        items: {
          totalAssignment: 3,
          assignments: assignmentsMock,
        },
      },
    };
    const result: CreatedAssignmentResponse =
      await service.getCreatedClassroomAssignments(
        'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
        1,
        50,
      );
    expect(result).toEqual(resultExpected);
  });

  it('Should deleted file and not throw an error', () => {
    try {
      service.deleteAttachmentFile(
        'http://localhost:3000/storages/teacher/attachments/1702095715631/tgs b indo 3.14 dan 4. 14 Sintya Kumara.pdf',
      );
    } catch (error) {
      if (error) {
        console.log(error);
        expect(error).toBeUndefined();
      }
    }
  });
});
