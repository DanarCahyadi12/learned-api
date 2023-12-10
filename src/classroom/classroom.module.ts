import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { AssignmentsService } from '../assignments/assignments.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClassroomController],
  providers: [ClassroomService, AssignmentsService],
})
export class ClassroomModule {}
