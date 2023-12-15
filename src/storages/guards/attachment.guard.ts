import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttachmentGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { user, url } = ctx.switchToHttp().getRequest();
    const attachmentURL: string = `${process.env.BASE_URL}${url
      .split('%20')
      .join(' ')}`;
    const { sub } = user;
    const isUserExits =
      await this.prismaService.assignment_attachments.findFirst({
        where: {
          attachmentURL,
        },
        select: {
          assignments: {
            select: {
              classroom: {
                select: {
                  userJoined: {
                    where: {
                      userID: sub,
                    },
                  },
                },
              },
            },
          },
        },
      });
    if (!isUserExits.assignments.classroom.userJoined.length) return false;
    return true;
  }
}
