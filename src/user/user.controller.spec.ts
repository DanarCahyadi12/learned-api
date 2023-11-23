import { UserService } from './user.service';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { UserEntity } from './entity';
import { UserController } from './user.controller';
import { UserPayload } from './interfaces';
describe('UserService', () => {
  let userController: UserController;
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: PrismaMock,
          useValue: prismaMock,
        },
      ],
    }).compile();
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('It Should return a user payload', async () => {
    const user: UserEntity = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      pictureURL: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
      refreshToken: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userPayload: UserPayload = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      pictureURL: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(userService, 'findOneById').mockImplementation(async () => user);
    const result = await userController.getUser(
      'cdfe9601-dfb2-4708-9449-f36e446e1b11',
    );
    expect(result).toEqual(userPayload);
  });
});
