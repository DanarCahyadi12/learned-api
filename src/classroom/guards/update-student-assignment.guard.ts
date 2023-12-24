import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UpdateStudentAssignmentGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { user, params } = ctx.switchToHttp().getRequest();
    const { sub } = user;
    const { studentAssignmentID } = params;
    return await this.validate(sub, studentAssignmentID);
  }

  async validate(userID: string, studentAssignmentID: string) {
    const studentID: string = (
      await this.prismaService.student_assignments.findFirst({
        where: {
          AND: [
            {
              userID,
            },
            {
              id: studentAssignmentID,
            },
          ],
        },
        select: {
          id: true,
        },
      })
    ).id;

    return studentID ? true : false;
  }
}
