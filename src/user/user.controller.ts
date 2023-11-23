import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entity';
import { UserPayload } from './interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserPayload> {
    const user: UserEntity = await this.userService.findOneById(id);
    return {
      id: user.id,
      name: user.name,
      bio: user.bio,
      pictureURL: user.pictureURL,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
