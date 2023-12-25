import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto, UpdateMaterialDto } from './DTOs';
import { CreateMaterialResponse, GetMaterialResponse } from './interfaces';
import { join } from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { MaterialsEntity } from './entity';
import { getNextUrl, getPrevUrl, removeFile } from '../utils';

@Injectable()
export class MaterialsService {
  constructor(private prismaService: PrismaService) {}

  async createMaterials(
    classroomID: string,
    dto: CreateMaterialDto,
    materials: Express.Multer.File[],
  ): Promise<CreateMaterialResponse> {
    try {
      const materialID: string = await this.storeMaterials(
        dto,
        classroomID,
        materials,
      );
      return {
        status: 'success',
        message: 'Create materials successfully',
        data: {
          id: materialID,
        },
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        ['Error while creating material'],
        { cause: err, description: err },
      );
    }
  }

  async storeMaterials(
    dto: CreateMaterialDto,
    classroomID: string,
    materials: Express.Multer.File[],
  ): Promise<string> {
    const materialFiles = [];
    try {
      materials.forEach((material) => {
        const randomFolderName: string = crypto.randomBytes(16).toString('hex');
        const path: string = join(
          __dirname,
          '..',
          '..',
          'storages',
          'teacher',
          'materials',
          randomFolderName,
        );
        const materialURL: string = `${process.env.BASE_URL}/storages/teacher/materials/${randomFolderName}/${material.originalname}`;
        this.moveMaterialFiles(material.buffer, path, material.originalname);
        materialFiles.push({
          filename: material.originalname,
          materialURL,
          path: `${path}\\${material.originalname}`,
        });
      });
      return (
        await this.prismaService.materials.create({
          data: {
            ...dto,
            classroomID,
            materialFiles: {
              createMany: {
                data: materialFiles,
              },
            },
          },
        })
      ).id;
    } catch (error) {
      throw error;
    }
  }

  moveMaterialFiles(buffer: Buffer, path: string, filename: string): void {
    fs.mkdir(path, (err) => {
      if (err) throw err;
      fs.writeFile(`${path}\\${filename}`, buffer, (err) => {
        if (err) throw err;
      });
    });
  }

  async updateMaterials(
    materialID: string,
    dto: UpdateMaterialDto,
    files: Express.Multer.File[],
  ) {
    try {
      if (files) {
        await this.updateMaterialsAndAddNewFiles(materialID, dto, files);
      } else {
        await this.prismaService.materials.update({
          where: {
            id: materialID,
          },
          data: {
            title: dto.title,
            description: dto.description,
            updatedAt: new Date(),
          },
        });
      }
      if (dto?.deleteFiles)
        await this.deleteMaterialFiles(dto.deleteFiles, materialID);

      return {
        status: 'success',
        message: 'Materials updated successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async updateMaterialsAndAddNewFiles(
    materialID: string,
    dto: UpdateMaterialDto,
    files: Express.Multer.File[],
  ): Promise<MaterialsEntity> {
    try {
      const materialFiles = [];
      files.forEach((file) => {
        const randomFolderName: string = crypto.randomBytes(16).toString('hex');
        const path: string = join(
          __dirname,
          '..',
          '..',
          'storages',
          'teacher',
          'materials',
          randomFolderName,
        );
        const materialURL: string = `${process.env.BASE_URL}/storages/teacher/materials/${randomFolderName}/${file.originalname}`;
        this.moveMaterialFiles(file.buffer, path, file.originalname);
        materialFiles.push({
          filename: file.originalname,
          materialURL,
          path: `${path}\\${file.originalname}`,
        });
      });
      return await this.prismaService.materials.update({
        where: {
          id: materialID,
        },
        data: {
          title: dto.title,
          description: dto.description,
          updatedAt: new Date(),
          materialFiles: {
            createMany: {
              data: materialFiles,
            },
          },
        },
        include: {
          materialFiles: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteMaterialFiles(IDs: string[], materialID: string) {
    try {
      const paths = await this.prismaService.material_files.findMany({
        where: {
          id: {
            in: IDs,
          },
        },
        select: {
          path: true,
        },
      });
      const totalFiles: number = await this.prismaService.material_files.count({
        where: {
          materialID: materialID,
        },
      });
      if (totalFiles === paths.length)
        throw new BadRequestException(['Material files is required']);
      paths.forEach((objectPath) => {
        removeFile(objectPath.path);
      });
      return await this.prismaService.material_files.deleteMany({
        where: {
          id: {
            in: IDs,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async getMaterials(
    classroomID: string,
    page: number,
    take: number,
  ): Promise<GetMaterialResponse> {
    try {
      const materials: MaterialsEntity[] =
        await this.prismaService.materials.findMany({
          where: {
            classroomID,
          },
          include: {
            materialFiles: true,
          },
        });
      const totalMaterial: number = await this.prismaService.materials.count({
        where: {
          classroomID,
        },
      });
      const totalPage: number = Math.ceil(totalMaterial / take);
      return {
        status: 'success',
        message: 'Get materials successfully!',
        data: {
          totalPage,
          prev: getPrevUrl(page, take, `classroomn/${classroomID}/materials`),
          currentPage: page,
          next: getNextUrl(
            totalPage,
            take,
            page,
            `classroomn/${classroomID}/materials`,
          ),
          items: {
            totalMaterial,
            materials,
          },
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(['Error while get materials'], {
        cause: error,
        description: error,
      });
    }
  }
}
