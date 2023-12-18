import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ClassroomService } from '../classroom.service';

@Injectable()
export class ClassroomGuard implements CanActivate {
  constructor(private classroomService: ClassroomService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { user, params } = ctx.switchToHttp().getRequest();
    const classroomID = params.id;
    const { sub } = user;
    const classroom =
      await this.classroomService.findOneClassroomParticipantByClassroomIdAndUserID(
        classroomID,
        sub,
      );
    return classroom ? true : false;
  }
}
