import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './DTOs';
import { CreateMaterialResponse } from './interfaces';
import { join } from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class MaterialsService {
  constructor(private prismaService: PrismaService) {}

  async createMaterials(
    classroomID: string,
    dto: CreateMaterialDto,
    materials: Express.Multer.File[],
  ): Promise<CreateMaterialResponse> {
    try {
      const materialID: string = (
        await this.prismaService.materials.create({
          data: {
            ...dto,
            classroomID,
          },
        })
      ).id;

      if (materials) await this.createMaterialFiles(materialID, materials);
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

  async createMaterialFiles(
    materialID: string,
    materials: Express.Multer.File[],
  ): Promise<void> {
    const materialFiles = [];
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
        materialID,
        materialURL,
        path: `${path}\\${material.originalname}`,
      });
    });
    await this.prismaService.material_files.createMany({
      data: materialFiles,
    });
    try {
    } catch (error) {
      throw error;
    }
  }

  moveMaterialFiles(buffer: Buffer, path: string, filename: string): void {
    fs.mkdir(path, (err) => {
      if (err) throw err;
      console.log('Directory created');
      fs.writeFile(`${path}\\${filename}`, buffer, (err) => {
        if (err) throw err;
        console.log('File created');
      });
    });
  }
}
