import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { AttachmentGuard } from './guards';

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
    const filePath: string = await this.storagesService.getAttachment(
      folder,
      file,
    );
    const readStream = createReadStream(filePath);
    return readStream.pipe(res);
  }
}
