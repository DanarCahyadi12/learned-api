import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsService } from './materials.service';
import { MaterialsEntity } from './entity';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import { CreateMaterialDto } from './DTOs';
import { CreateMaterialResponse } from './interfaces';
import { PrismaModule } from '../prisma/prisma.module';

describe('MaterialsService', () => {
  let service: MaterialsService;
  const materialsMock: MaterialsEntity[] = [
    {
      id: '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
      title: 'Material 1',
      description: 'Ini merupakan materi 1',
      updatedAt: new Date(),
      classroomID: 'e29ae274-4086-4a59-b072-c08165a2e4ea',
    },
    {
      id: '5564f6c9-8281-43a9-b747-c8a7076cdc6a',
      title: 'Material 2',
      description: 'Ini merupakan materi 2',
      updatedAt: new Date(),
      classroomID: 'e29ae274-4086-4a59-b072-c08165a2e4ea',
    },
    {
      id: 'ae22152d-83c9-4da9-bb98-1243c9335b70',
      title: 'Material 3',
      description: 'Ini merupakan materi 3',
      updatedAt: new Date(),
      classroomID: 'e29ae274-4086-4a59-b072-c08165a2e4ea',
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        MaterialsService,
        {
          provide: PrismaMock,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<MaterialsService>(MaterialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return valid response after creating a material', async () => {
    const dto: CreateMaterialDto = {
      title: 'Materi 1',
      description: 'Ini materi 1',
    };

    (prismaMock.materials.create as jest.Mock).mockResolvedValue(
      materialsMock[0],
    );

    const expectedResult: CreateMaterialResponse = {
      status: 'success',
      message: 'Create materials successfully',
      data: {
        id: '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
      },
    };

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
          originalname: 'materi PBO.pdf',
          buffer: Buffer.from('Ini merupakan modul PBO'),
        },
        {
          filename: null,
          stream: null,
          destination: null,
          path: null,
          fieldname: 'materials',
          encoding: '7bit',
          mimetype: 'application/pdf',
          size: 1024 * 1024 * 5,
          originalname: 'materi 2 PBO.pdf',
          buffer: Buffer.from('Ini merupakan modul PBO 2'),
        },
      ],
    };
    const result: CreateMaterialResponse = await service.createMaterials(
      'e29ae274-4086-4a59-b072-c08165a2e4ea',
      dto,
      files.materials,
    );
    expect(result).toEqual(expectedResult);
  });
});
