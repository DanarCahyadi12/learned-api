import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsService } from './materials.service';
import { MaterialFilesEntity, MaterialsEntity } from './entity';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import { CreateMaterialDto, UpdateMaterialDto } from './DTOs';
import { CreateMaterialResponse, GetMaterialResponse } from './interfaces';
import { PrismaModule } from '../prisma/prisma.module';

describe('MaterialsService', () => {
  let service: MaterialsService;
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
        originalname: 'LAPORAN PKL Danar Cahyadi.pdf',
        buffer: Buffer.from('Ini merupakan laporan danar cahyadi'),
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
  const materialFiles: MaterialFilesEntity[] = [
    {
      id: '337c95f5-3173-4ebb-b077-ac7c4dad0888',
      createdAt: new Date(),
      filename: 'LAPORAN PKL Danar Cahyadi.pdf',
      path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
      materialURL:
        'http://localhost:3000/storages/teacher/materials/7fa537e371c02de21b9dbc3d9e280740/LAPORAN PKL Danar Cahyadi.pdf',
      materialID: '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
    },
    {
      id: 'c4865002-d8e7-4527-8122-c8fceec8838b',
      createdAt: new Date(),
      path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
      materialURL:
        'http://localhost:3000/storages/teacher/materials/7fa537e371c02de21b9dbc3d9e280740/LAPORAN PKL Danar Cahyadi.pdf',
      materialID: '5564f6c9-8281-43a9-b747-c8a7076cdc6a',
      filename: 'LAPORAN PKL Danar Cahyadi.pdf',
    },
    {
      id: '117f8750-9d04-4794-9460-68f147a2c86c',
      createdAt: new Date(),
      path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
      materialURL:
        'http://localhost:3000/storages/teacher/materials/7fa537e371c02de21b9dbc3d9e280740/LAPORAN PKL Danar Cahyadi.pdf',
      materialID: 'ae22152d-83c9-4da9-bb98-1243c9335b70',
      filename: 'LAPORAN PKL Danar Cahyadi.pdf',
    },
  ];

  const deleteMaterialFilesReturnedMock = {
    count: 1,
    batch: [
      {
        id: '337c95f5-3173-4ebb-b077-ac7c4dad0888',
        createdAt: new Date(),
        path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
        materialURL:
          'http://localhost:3000/storages/teacher/materials/7fa537e371c02de21b9dbc3d9e280740/LAPORAN PKL Danar Cahyadi.pdf',
        materialID: '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
      },
    ],
  };

  const deleteMaterialMocks = {
    count: 1,
    batch: [
      {
        id: '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
        title: 'Material 1',
        description: 'Ini merupakan materi 1',
        updatedAt: new Date(),
        classroomID: 'e29ae274-4086-4a59-b072-c08165a2e4ea',
      },
    ],
  };
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

    const result: CreateMaterialResponse = await service.createMaterials(
      'e29ae274-4086-4a59-b072-c08165a2e4ea',
      dto,
      files.materials,
    );
    expect(result).toEqual(expectedResult);
  });

  it('Should return valid response and valid material data', async () => {
    const dataMock: MaterialsEntity[] = materialsMock.map((material) => {
      return {
        ...material,
        files: materialFiles.filter((file) => file.materialID === material.id),
      };
    });
    (prismaMock.materials.findMany as jest.Mock).mockResolvedValue(dataMock);
    (prismaMock.materials.count as jest.Mock).mockResolvedValue(3);
    const resultExpected: GetMaterialResponse = {
      status: 'success',
      message: 'Get materials successfully!',
      data: {
        totalPage: 1,
        prev: null,
        currentPage: 1,
        next: null,
        items: {
          totalMaterial: 3,
          materials: dataMock,
        },
      },
    };

    const result = await service.getMaterials(
      'e29ae274-4086-4a59-b072-c08165a2e4ea',
      1,
      50,
    );
    expect(result).toEqual(resultExpected);
  });

  it('Should  successfully update material and create new files', async () => {
    const currentDate = new Date();
    const dto: UpdateMaterialDto = {
      title: 'Updated',
      description: 'This is description',
    };
    (prismaMock.materials.update as jest.Mock).mockResolvedValue({
      ...materialsMock[0],
      title: 'Updated',
      description: 'This is description',
      updatedAt: currentDate,
      materialFiles: [
        {
          ...materialFiles[0],
          createdAt: currentDate,
        },
      ],
    });
    const expectedResult: MaterialsEntity = {
      id: '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
      title: 'Updated',
      description: 'This is description',
      updatedAt: currentDate,
      classroomID: 'e29ae274-4086-4a59-b072-c08165a2e4ea',
      materialFiles: [
        {
          id: '337c95f5-3173-4ebb-b077-ac7c4dad0888',
          createdAt: currentDate,
          path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
          materialURL:
            'http://localhost:3000/storages/teacher/materials/7fa537e371c02de21b9dbc3d9e280740/LAPORAN PKL Danar Cahyadi.pdf',
          materialID: '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
          filename: 'LAPORAN PKL Danar Cahyadi.pdf',
        },
      ],
    };
    const result: MaterialsEntity = await service.updateMaterialsAndAddNewFiles(
      '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
      dto,
      [files.materials[0]],
    );
    expect(result).toEqual(expectedResult);
  });

  it('Should delete material files', async () => {
    (prismaMock.material_files.deleteMany as jest.Mock).mockResolvedValue(
      deleteMaterialFilesReturnedMock,
    );
    (prismaMock.material_files.findMany as jest.Mock).mockResolvedValue([
      {
        path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
      },
    ]);
    (prismaMock.material_files.count as jest.Mock).mockResolvedValue(2);
    const result = await service.deleteMaterialFiles(
      ['337c95f5-3173-4ebb-b077-ac7c4dad0888'],
      '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
    );
    expect(result).toEqual(deleteMaterialFilesReturnedMock);
  });

  it('Should updated materials with add new material files and delete material files', async () => {
    const currentDate = new Date();
    const dto: UpdateMaterialDto = {
      title: 'Updated',
      description: 'This is description',
      deleteFiles: [
        '337c95f5-3173-4ebb-b077-ac7c4dad0888',
        'c4865002-d8e7-4527-8122-c8fceec8838b',
      ],
    };
    (prismaMock.material_files.count as jest.Mock).mockResolvedValue(2);
    (prismaMock.materials.update as jest.Mock).mockResolvedValue({
      ...materialsMock[0],
      title: 'Updated',
      description: 'This is description',
      updatedAt: currentDate,
      material_files: [
        {
          ...materialFiles[0],
          createdAt: currentDate,
        },
      ],
    });
    (prismaMock.material_files.findMany as jest.Mock).mockResolvedValue([
      {
        path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
      },
    ]);
    (prismaMock.material_files.deleteMany as jest.Mock).mockResolvedValue(
      deleteMaterialFilesReturnedMock,
    );

    const result = await service.updateMaterials(
      '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
      dto,
      [files.materials[0]],
    );
    expect(async () => {
      await service.updateMaterials(
        '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
        dto,
        [files.materials[0]],
      );
    }).resolves;
    expect(result).toEqual({
      status: 'success',
      message: 'Materials updated successfully',
    });
  });

  it('Should updating materials without adding new material files , deleting material files', async () => {
    const currentDate = new Date();
    const dto: UpdateMaterialDto = {
      title: 'Updated',
      description: 'This is description',
    };
    (prismaMock.materials.update as jest.Mock).mockResolvedValue({
      ...materialsMock[0],
      title: 'Updated',
      description: 'This is description',
      updatedAt: currentDate,
    });
    const result = await service.updateMaterials(
      '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
      dto,
      undefined,
    );
    expect(async () => {
      await service.updateMaterials(
        '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
        dto,
        undefined,
      );
    }).resolves;
    expect(result).toEqual({
      status: 'success',
      message: 'Materials updated successfully',
    });
  });

  it('Should delete materials', async () => {
    (prismaMock.materials.deleteMany as jest.Mock).mockResolvedValue(
      deleteMaterialMocks,
    );
    (prismaMock.materials.findMany as jest.Mock).mockResolvedValue([
      {
        materialFiles: [
          {
            path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
          },
        ],
      },
    ]);
    const result = await service.deleteMaterials([
      '744aa22b-48e9-4ea3-ae3f-814d3fb5747d',
    ]);
    expect(async () => {
      await service.deleteMaterials(['744aa22b-48e9-4ea3-ae3f-814d3fb5747d']);
    }).resolves;
    expect(result).toEqual({
      status: 'success',
      message: 'Materials deleted',
    });
  });
});
