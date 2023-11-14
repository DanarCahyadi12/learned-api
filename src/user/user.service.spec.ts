import { UserService } from './user.service';
import { createUserDto } from './DTOs';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';

describe('UserService', () => {
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        UserService,
        {
          provide: PrismaMock,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('Should return entity of user after creating a user', async () => {
    const dto: createUserDto = {
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '12345678',
    };
    const user = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      pictureURL: null,
      refreshToken: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.create as jest.Mock).mockResolvedValue(user);

    const userCreated = await userService.createUser(dto);
    expect(userCreated).toHaveProperty('id');
    expect(userCreated.name).toBe('I Ketut Danar Cahyadi');
    expect(userCreated.email).toBe('danar@gmail.com');
    expect(userCreated.pictureURL).toBeNull();
    expect(userCreated.refreshToken).toBeNull();
    expect(userCreated.bio).toBeNull();
  });

  it('Should return a user ', async () => {
    const userResult = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      pictureURL: null,
      refreshToken: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest
      .spyOn(userService, 'findOneByEmail')
      .mockImplementation(async () => userResult);
    const user = await userService.findOneByEmail('danar@gmail.com');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('pictureURL');
    expect(user).toHaveProperty('bio');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
    expect(user).toHaveProperty('refreshToken');
    expect(user.email).toBe('danar@gmail.com');
  });

  it('Refresh token should updated', async () => {
    const refreshToken: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const userResult = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      pictureURL: null,
      refreshToken: refreshToken,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const idUser: string = '0bea6fd5-c889-4e3e-9998-ee87f6656878';

    jest
      .spyOn(userService, 'updateRefreshTokenUser')
      .mockImplementation(async () => userResult);
    const result = await userService.updateRefreshTokenUser(
      idUser,
      refreshToken,
    );
    expect(result).toBeDefined();
    expect(result).toHaveProperty('refreshToken');
    expect(result).not.toBeNull();
    expect(result).toBeDefined();
  });
});
