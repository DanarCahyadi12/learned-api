import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsService } from './assignments.service';
import {
  AssignmentEntity,
  StudentAssignmentAttachmentEntity,
  StudentAssignmentEntity,
  ListStudentAssignments,
} from './entity';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import {
  GetAssignmentResponse,
  GetDetailAssignmentResponse,
  GetListStudentAssignmentResponse,
  PostStudentAssignmentResponse,
} from './interfaces';
import { PrismaModule } from '../prisma/prisma.module';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { join } from 'path';
import { CreateStudentAssignmentDto } from './DTOs';
describe('AssignmentsService', () => {
  let service: AssignmentsService;
  // const deleteStudentAssignmentMocks = [
  //   {
  //     count: 2,
  //     batch: [
  //       {
  //         id: '35e03d3b-4b09-440b-bf1b-5f6a9c79128c',
  //         type: 'FILE',
  //         studentAssignmentID: '83d4f211-148d-4513-9566-e7bad8745f7c',
  //         attachmentPath:
  //           'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\student\\attachments\\test.pdf',
  //         attachmentURL:
  //           'http://localhost:3000/storages/student/attachments/2938npor93sdoq/test.pdf',
  //       },
  //       {
  //         id: '7ed63d55-799c-4de4-95f2-ca6b0641d7cf',
  //         type: 'URL',
  //         studentAssignmentID: '83d4f211-148d-4513-9566-e7bad8745f7c',
  //         attachmentPath: null,
  //         attachmentURL: 'https://example.com/assignments',
  //       },
  //     ],
  //   },
  // ];
  const files = {
    materials: [
      {
        filename: null,
        stream: null,
        destination: null,
        path: null,
        fieldname: 'materials',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024 * 1024 * 5,
        originalname: 'test.pdf',
        buffer: Buffer.from('Ini merupakan tugas PBO'),
      },
    ],
  };

  const studentAssignmentMocks: StudentAssignmentEntity[] = [
    {
      id: '83d4f211-148d-4513-9566-e7bad8745f7c',
      assignmentID: '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
      submitedAt: new Date(),
      updatedAt: new Date(),
      overdue: false,
      userID: '9c82bf47-ce2f-46d8-a0ca-54b905c12a0b',
    },
    {
      id: 'dd7ccd10-2272-40f3-b060-d879af555845',
      assignmentID: '07177838-3ae8-4fc6-9982-623251c836b0',
      submitedAt: new Date(),
      updatedAt: new Date(),
      overdue: false,
      userID: '9c82bf47-ce2f-46d8-a0ca-54b905c12a0b',
    },
    {
      id: '72a6101f-fc45-48e1-8c9a-c9d80e07619a',
      assignmentID: 'b31e3a8e-89d2-462e-9e4d-8bb4b04d634d',
      submitedAt: new Date(),
      updatedAt: new Date(),
      overdue: false,
      userID: '9c82bf47-ce2f-46d8-a0ca-54b905c12a0b',
    },
  ];

  const studentAssignmentAttachmentMocks: StudentAssignmentAttachmentEntity[] =
    [
      {
        id: '35e03d3b-4b09-440b-bf1b-5f6a9c79128c',
        type: 'FILE',
        studentAssignmentID: '83d4f211-148d-4513-9566-e7bad8745f7c',
        attachmentPath:
          'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\student\\attachments\\test.pdf',
        attachmentURL:
          'http://localhost:3000/storages/student/attachments/2938npor93sdoq/test.pdf',
      },
      {
        id: '7ed63d55-799c-4de4-95f2-ca6b0641d7cf',
        type: 'URL',
        studentAssignmentID: '83d4f211-148d-4513-9566-e7bad8745f7c',
        attachmentPath: null,
        attachmentURL: 'https://example.com/assignments',
      },
    ];
  const assignmentsMock: AssignmentEntity[] = [
    {
      id: '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
      title: 'assignment 1',
      isOpen: true,
      description: null,
      openedAt: new Date(),
      dueAt: null,
      passGrade: null,
      extensions: '.jpg, .png',
      allowSeeGrade: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      classroomID: 'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
      attachments: [
        {
          id: '3271f3cd-dfae-4ae9-bed',
          path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\attachments\\test.pdf',
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
      isOpen: true,
      createdAt: new Date(),
      openedAt: new Date(),
      dueAt: null,
      passGrade: null,
      extensions: '.jpg, .png',
      allowSeeGrade: false,
      updatedAt: new Date(),
      classroomID: 'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
      attachments: [
        {
          id: '07177838-3ae8-4fc6-s5',
          path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\attachments\\test.pdf',
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
      isOpen: true,
      createdAt: new Date(),
      openedAt: new Date(),
      dueAt: null,
      passGrade: null,
      extensions: '.jpg, .png',
      allowSeeGrade: false,
      updatedAt: new Date(),
      classroomID: 'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
      attachments: [
        {
          id: '07177838-3ae8-4fc6-s5-90sh',
          path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\attachments\\test.pdf',
          attachmentURL:
            'http://example.com/storages/teacher/attachments/test.pdf',
          name: 'test.pdf',
          assignmentID: 'b31e3a8e-89d2-462e-9e4d-8bb4b04d634d',
          createdAt: new Date(),
        },
      ],
    },
  ];

  const listStudentAssignmentMocks: ListStudentAssignments[] = [
    {
      id: 'f6198eda-98f7-46cb-b5f1-5ae33656d9be',
      submitedAt: new Date(),
      updatedAt: new Date(),
      overdue: false,
      studentAttachments: studentAssignmentAttachmentMocks,
      users: {
        id: '1098b63a-5114-40b6-9210-5e0ddcd5a2ac',
        name: 'I Ketut Danar Cahyadi',
        avatarURL:
          'https://lh3.googleusercontent.com/a/ACg8ocKdyLX_B8ywM1dPWdZBcmDyM2jecENebOupFxPZYKLc=s96-c',
      },
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        AssignmentsService,
        {
          useValue: prismaMock,
          provide: PrismaMock,
        },
      ],
    }).compile();

    service = module.get<AssignmentsService>(AssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return created classroom assigments and valid response', async () => {
    (prismaMock.assignments.findMany as jest.Mock).mockResolvedValue(
      assignmentsMock,
    );
    (prismaMock.assignments.count as jest.Mock).mockResolvedValue(3);
    const resultExpected: GetAssignmentResponse = {
      status: 'success',
      message: 'Get classroom assignments successfully',
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
    const result: GetAssignmentResponse = await service.getAssignments(
      'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
      1,
      50,
    );
    expect(result).toEqual(resultExpected);
  });

  it('Should return created assignments', async () => {
    (prismaMock.assignments.findMany as jest.Mock).mockResolvedValue(
      assignmentsMock,
    );
    const result: AssignmentEntity[] = await service.findManyByClassroomID(
      'edc2f366-f2c0-428b-8eca-2c1fe86efb02',
      1,
      50,
    );
    expect(result).toEqual(assignmentsMock);
  });

  it('Should deleted file and not throw an error', () => {
    expect(
      service.deleteAttachmentFile(
        'http://localhost:3000/storages/teacher/attachments/1702095715631/tgs b indo 3.14 dan 4. 14 Sintya Kumara.pdf',
      ),
    ).toBeUndefined();
  });

  it('Should return assignment by id', async () => {
    (prismaMock.assignments.findUnique as jest.Mock).mockResolvedValue(
      assignmentsMock[0],
    );
    const result: AssignmentEntity = await service.findOneById(
      assignmentsMock[0].id,
    );
    expect(result).toEqual(assignmentsMock[0]);
  });

  it('Get detail assignment should return valid response', async () => {
    (prismaMock.assignments.findUnique as jest.Mock).mockResolvedValue(
      assignmentsMock[0],
    );
    const expectedResult: GetDetailAssignmentResponse = {
      status: 'success',
      message: 'Get detail assignment successfully',
      data: assignmentsMock[0],
    };
    const result: GetDetailAssignmentResponse =
      await service.getDetailAssignment(assignmentsMock[0].id);
    expect(result).toEqual(expectedResult);
  });

  it('Get detail assignment should throw a NotFoundException', async () => {
    (prismaMock.assignments.findUnique as jest.Mock).mockResolvedValue(
      undefined,
    );

    expect(async () => {
      await service.getDetailAssignment('invalid ID');
    }).rejects.toThrow(NotFoundException);
  });

  it('Should not throw an error while updating closed and opened assignments', async () => {
    expect(async () => {
      await service.updateOpenedAssignment();
    }).resolves;
  });

  it('Should create a student assignment', async () => {
    (prismaMock.student_assignments.create as jest.Mock).mockResolvedValue({
      ...studentAssignmentMocks[0],
      studentAttachments: studentAssignmentAttachmentMocks,
    });
    const dto: CreateStudentAssignmentDto = {
      assignmentID: '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
      userID: '9c82bf47-ce2f-46d8-a0ca-54b905c12a0b',
      overdue: false,
      URLs: [
        'https://google.com/drive/as323ic30p--2mdioef',
        'https://google.com/drive/as323ic30p--2mdioef',
      ],
      files: files.materials,
    };
    const result = await service.createStudentAssignment(dto);
    expect(result).toEqual({
      id: '83d4f211-148d-4513-9566-e7bad8745f7c',
      assignmentID: '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
      submitedAt: studentAssignmentMocks[0].submitedAt,
      updatedAt: studentAssignmentMocks[0].updatedAt,
      overdue: false,
      userID: '9c82bf47-ce2f-46d8-a0ca-54b905c12a0b',
      studentAttachments: [
        {
          id: '35e03d3b-4b09-440b-bf1b-5f6a9c79128c',
          type: 'FILE',
          studentAssignmentID: '83d4f211-148d-4513-9566-e7bad8745f7c',
          attachmentPath:
            'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\student\\attachments\\test.pdf',
          attachmentURL:
            'http://localhost:3000/storages/student/attachments/2938npor93sdoq/test.pdf',
        },
        {
          id: '7ed63d55-799c-4de4-95f2-ca6b0641d7cf',
          type: 'URL',
          studentAssignmentID: '83d4f211-148d-4513-9566-e7bad8745f7c',
          attachmentPath: null,
          attachmentURL: 'https://example.com/assignments',
        },
      ],
    });
  });

  it('Should create user assignment file', () => {
    const buffer: Buffer = Buffer.from('TEST TEST 1 2 3 4');
    const randomFolderName: string = crypto.randomBytes(16).toString('hex');
    const dir: string = join(
      __dirname,
      '..',
      '..',
      'storages',
      'student',
      'assignments',
      randomFolderName,
    );
    const filename: string = 'test.pdf';
    expect(
      service.moveUserAssignmentFiles(buffer, dir, filename),
    ).toBeUndefined();
  });

  it('Post student assignment with dto and files', async () => {
    const dto: string[] = ['https://google.com/drive/video'];
    const expectedResult: PostStudentAssignmentResponse = {
      status: 'success',
      message: 'Assignment successfully posted',
      data: {
        id: studentAssignmentMocks[0].id,
      },
    };
    (prismaMock.student_assignments.create as jest.Mock).mockResolvedValue(
      studentAssignmentMocks[0],
    );

    (
      prismaMock.student_assignment_attachments.createMany as jest.Mock
    ).mockResolvedValue(studentAssignmentAttachmentMocks);
    (prismaMock.assignments.findUnique as jest.Mock).mockResolvedValue(
      assignmentsMock[0],
    );
    const result = await service.postStudentAssignment(
      '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
      '9c82bf47-ce2f-46d8-a0ca-54b905c12a0b',
      dto,
      files.materials,
    );

    expect(result).toEqual(expectedResult);
  });
  it('Should throw an BadRequest Exception', async () => {
    (prismaMock.student_assignments.create as jest.Mock).mockResolvedValue(
      studentAssignmentMocks[0],
    );

    (
      prismaMock.student_assignment_attachments.createMany as jest.Mock
    ).mockResolvedValue(studentAssignmentAttachmentMocks);
    (prismaMock.assignments.findUnique as jest.Mock).mockResolvedValue(
      assignmentsMock[0],
    );
    expect(async () => {
      await service.postStudentAssignment(
        '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
        '9c82bf47-ce2f-46d8-a0ca-54b905c12a0b',
        undefined,
        undefined,
      );
    }).rejects.toThrow(BadRequestException);
  });
  it('Should throw an BadRequest Exception', async () => {
    const dto: string[] = ['https://google.com/drive/video'];
    (prismaMock.student_assignments.create as jest.Mock).mockResolvedValue(
      studentAssignmentMocks[0],
    );

    (
      prismaMock.student_assignment_attachments.createMany as jest.Mock
    ).mockResolvedValue(studentAssignmentAttachmentMocks);
    (prismaMock.assignments.findUnique as jest.Mock).mockResolvedValue(
      undefined,
    );
    expect(async () => {
      await service.postStudentAssignment(
        '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
        '9c82bf47-ce2f-46d8-a0ca-54b905c12a0b',
        dto,
        files.materials,
      );
    }).rejects.toThrow(NotFoundException);
  });

  it('Should return student assignments', async () => {
    const expectedResult: ListStudentAssignments[] = [
      {
        id: 'f6198eda-98f7-46cb-b5f1-5ae33656d9be',
        submitedAt: listStudentAssignmentMocks[0].submitedAt,
        updatedAt: listStudentAssignmentMocks[0].updatedAt,
        overdue: false,
        studentAttachments: studentAssignmentAttachmentMocks,
        users: {
          id: '1098b63a-5114-40b6-9210-5e0ddcd5a2ac',
          name: 'I Ketut Danar Cahyadi',
          avatarURL:
            'https://lh3.googleusercontent.com/a/ACg8ocKdyLX_B8ywM1dPWdZBcmDyM2jecENebOupFxPZYKLc=s96-c',
        },
      },
    ];
    (prismaMock.student_assignments.findMany as jest.Mock).mockResolvedValue(
      listStudentAssignmentMocks,
    );

    const result: ListStudentAssignments[] =
      await service.findListStudentAssignments(
        '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
        1,
        50,
      );
    expect(result).toEqual(expectedResult);
  });

  it('It Should return valid response and list student assignments', async () => {
    (prismaMock.assignments.findUnique as jest.Mock).mockResolvedValue(
      assignmentsMock[0],
    );

    (prismaMock.student_assignments.findMany as jest.Mock).mockResolvedValue(
      listStudentAssignmentMocks,
    );

    const expectedResult: GetListStudentAssignmentResponse = {
      status: 'success',
      message: 'Get list of student assignments successfully',
      data: {
        totalPage: 1,
        prev: null,
        currentPage: 1,
        next: null,
        items: {
          totalAssignment: 1,
          assignments: [
            {
              id: 'f6198eda-98f7-46cb-b5f1-5ae33656d9be',
              submitedAt: listStudentAssignmentMocks[0].submitedAt,
              updatedAt: listStudentAssignmentMocks[0].updatedAt,
              overdue: false,
              studentAttachments: studentAssignmentAttachmentMocks,
              users: {
                id: '1098b63a-5114-40b6-9210-5e0ddcd5a2ac',
                name: 'I Ketut Danar Cahyadi',
                avatarURL:
                  'https://lh3.googleusercontent.com/a/ACg8ocKdyLX_B8ywM1dPWdZBcmDyM2jecENebOupFxPZYKLc=s96-c',
              },
            },
          ],
        },
      },
    };
    (prismaMock.student_assignments.count as jest.Mock).mockResolvedValue(1);
    const result: GetListStudentAssignmentResponse =
      await service.getListStudentAssignments(
        '3271f3cd-dfae-4ae9-bed0-b9d9918deea6',
        1,
        50,
      );
    expect(result).toEqual(expectedResult);
  });

  it('Should return a NotFound exception', async () => {
    (prismaMock.assignments.findUnique as jest.Mock).mockResolvedValue(
      undefined,
    );

    expect(async () => {
      await service.getListStudentAssignments('Invalid id', 1, 50);
    }).rejects.toThrow(NotFoundException);
  });
});
