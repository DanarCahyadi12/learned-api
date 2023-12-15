import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { AttachmentGuard, MaterialFilesGuard } from './guards';

@Controller('storages')
export class StoragesController {
  constructor(private storagesService: StoragesService) {}
  @UseGuards(AttachmentGuard)
  @Get('teacher/attachments/:folder/:file')
  async getAttachment(
    @Param('folder') folder: string,
    @Param('file') file: string,
    @Res() res: Response,
  ) {
    const directory: string = await this.storagesService.getAttachment(
      folder,
      file,
    );
    const readStream = createReadStream(directory);
    return readStream.pipe(res);
  }

  @UseGuards(MaterialFilesGuard)
  @Get('teacher/materials/:folder/:file')
  async getMaterialFile(
    @Param('folder') folder: string,
    @Param('file') filename: string,
    @Res() res: Response,
  ) {
    const directoy: string = await this.storagesService.getMaterialFile(
      folder,
      filename,
    );
    const readStream = createReadStream(directoy);
    return readStream.pipe(res);
  }
}
