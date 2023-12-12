import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoragesService {
  constructor(private prismaService: PrismaService) {}

  async getAttachment(folder: string, file: string): Promise<string> {
    const attachmentURL: string = `${process.env.BASE_URL}/storages/teacher/attachments/${folder}/${file}`;
    console.log(attachmentURL, 'PATH KONTOL');
    try {
      const filePath: string = (
        await this.prismaService.assignment_attachments.findFirst({
          where: {
            attachmentURL,
          },
        })
      ).path;

      return filePath;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ['Error while getting attachment file'],
        { cause: error, description: error },
      );
    }
  }
}
