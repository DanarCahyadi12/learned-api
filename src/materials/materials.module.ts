import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}
