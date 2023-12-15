import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MaterialFilesGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const { user, url } = req;
    const { sub } = user;

    const materialFileURL: string = `${process.env.BASE_URL}${url
      .split('%20')
      .join(' ')}`;
    const isUserExits = await this.prismaService.material_files.findFirst({
      where: {
        materialURL: materialFileURL,
      },
      select: {
        materials: {
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
    console.log(isUserExits);
    if (!isUserExits.materials.classroom.userJoined.length) return false;
    return true;
  }
}
