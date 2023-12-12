import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';

@Module({
  imports: [PrismaModule],
  controllers: [StoragesController],
  providers: [StoragesService],
})
export class StoragesModule {}
