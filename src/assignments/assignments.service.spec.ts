import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsService } from './assignments.service';
import { AssignmentEntity } from './entity';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import { GetAssignmentResponse } from './interfaces';
import { PrismaModule } from '../prisma/prisma.module';
describe('AssignmentsService', () => {
  let service: AssignmentsService;

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

    (prismaMock.assignments.findMany as jest.Mock).mockResolvedValue(
      assignmentsMock,
    );
    (prismaMock.assignments.count as jest.Mock).mockResolvedValue(3);
    const resultExpected: GetAssignmentResponse = {
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
    const result: GetAssignmentResponse = await service.getAssignments(
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
