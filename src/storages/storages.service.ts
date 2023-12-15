import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoragesService {
  constructor(private prismaService: PrismaService) {}

  async getAttachment(folder: string, file: string): Promise<string> {
    const attachmentURL: string = `${process.env.BASE_URL}/storages/teacher/attachments/${folder}/${file}`;
    try {
      const directory: string = (
        await this.prismaService.assignment_attachments.findFirst({
          where: {
            attachmentURL,
          },
        })
      ).path;
      if (!directory) throw new NotFoundException(['Attachment not found']);
      return directory;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ['Error while getting attachment file'],
        { cause: error, description: error },
      );
    }
  }

  async getMaterialFile(folder: string, filename: string): Promise<string> {
    const materialURL: string = `${process.env.BASE_URL}/storages/teacher/materials/${folder}/${filename}`;
    try {
      const directory: string = (
        await this.prismaService.material_files.findFirst({
          where: {
            materialURL,
          },
        })
      ).path;
      if (!directory) throw new NotFoundException(['Material not found']);
      return directory;
    } catch (err) {
      console.log(err);
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(
        ['Error while get material file'],
        { cause: err, description: err },
      );
    }
  }
}
