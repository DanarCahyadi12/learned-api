import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenPasswordGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.query?.['token'];
    const userID = req.query?.['userid'];
    console.log(token);
    console.log(userID);
    if (!token && !userID)
      throw new BadRequestException(
        'Query parameter token and user id is required',
      );
    const user = await this.userService.findOneById(userID);
    if (!user || !user.tokenPassword) {
      throw new BadRequestException('Token or user id is incorrect');
    }
    const matchToken = await bcrypt.compare(token, user.tokenPassword);
    if (!matchToken)
      throw new BadRequestException('Token or user id is incorrect');
    if (Date.now() > user.tokenPasswordExpires)
      throw new UnauthorizedException('Your token has expired');

    return true;
  }
}
