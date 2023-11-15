import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_KEY } from '../decorators';

@Injectable()
export class AccessTokenGuard extends AuthGuard('access-token') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) return true;
    return super.canActivate(context);
  }
}
