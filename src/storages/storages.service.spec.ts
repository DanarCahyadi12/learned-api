import { Test, TestingModule } from '@nestjs/testing';
import { StoragesService } from './storages.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StoragesController } from './storages.controller';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';

describe('StoragesService', () => {
  let service: StoragesService;
  const materialFileMock = {
    id: 'id',
    materialID: 'materialID',
    createdAt: new Date(),
    materialURL:
      'http://localhost:3000/storages/teacher/materials/7fa537e371c02de21b9dbc3d9e280740/LAPORAN PKL Danar Cahyadi.pdf',
    path: 'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [StoragesController],
      providers: [
        StoragesService,
        {
          provide: PrismaMock,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<StoragesService>(StoragesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return directory material files', async () => {
    (prismaMock.material_files.findFirst as jest.Mock).mockResolvedValue(
      materialFileMock,
    );
    const result: string = await service.getMaterialFile(
      '7fa537e371c02de21b9dbc3d9e280740',
      'LAPORAN PKL Danar Cahyadi.pdf',
    );
    expect(result).toEqual(
      'C:\\Users\\Danar Cahyadi\\OneDrive\\Desktop\\learned-api\\storages\\teacher\\materials\\7fa537e371c02de21b9dbc3d9e280740\\LAPORAN PKL Danar Cahyadi.pdf',
    );
  });
});
