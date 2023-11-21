import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TokenPasswordGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.query?.['token'];
    if (!token)
      throw new BadRequestException('Query parameter token is required');
    const user = await this.userService.findOneByTokenResetPassword(token);
    if (token !== user?.tokenPassword)
      throw new BadRequestException('Token is incorrect');
    if (Date.now() > user.tokenPasswordExpires)
      throw new UnauthorizedException('Your token has expired');

    return true;
  }
}
