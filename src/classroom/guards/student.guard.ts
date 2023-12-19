import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClassroomParticipantEntity } from '../entity';

@Injectable()
export class StudentGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    const { sub } = user;
    return await this.validate(sub, params.id);
  }
  async validate(userID: string, classroomID: string): Promise<boolean> {
    try {
      const user: ClassroomParticipantEntity =
        await this.prismaService.classroom_participants.findFirst({
          where: {
            userID,
            classroomID,
          },
        });

      if (!user) throw new NotFoundException(['User or classroom not found']);
      return user.role === Role.STUDENT ? true : false;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        ['Error while validate the user'],
        { cause: error, description: error },
      );
    }
  }
}
