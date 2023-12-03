import { UserService } from './user.service';
import { createUserDto } from './DTOs';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { UserEntity } from './entity';
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
      avatarURL: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
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
    expect(userCreated.avatarURL).toBeNull();
    expect(userCreated.refreshToken).toBeNull();
    expect(userCreated.bio).toBeNull();
  });

  it('Should return a user ', async () => {
    const userResult = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      avatarURL: null,
      refreshToken: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
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
    expect(user).toHaveProperty('avatarURL');
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
      avatarURL: null,
      refreshToken: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
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

  it('Should return a user ', async () => {
    const userResult = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      avatarURL: null,
      refreshToken: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(userService, 'findOneById')
      .mockImplementation(async () => userResult);
    const user = await userService.findOneById(
      'cdfe9601-dfb2-4708-9449-f36e446e1b11',
    );
    expect(user).toBeDefined();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('avatarURL');
    expect(user).toHaveProperty('refreshToken');
    expect(user).toHaveProperty('bio');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
    expect(user.id).toBe('cdfe9601-dfb2-4708-9449-f36e446e1b11');
    expect(user.name).toBe('I Ketut Danar Cahyadi');
    expect(user.email).toBe('danar@gmail.com');
  });
  it('Should return a null ', async () => {
    const userResult = null;

    jest
      .spyOn(userService, 'findOneById')
      .mockImplementation(async () => userResult);
    const user = await userService.findOneById('idsalah');
    expect(user).toBeNull();
  });

  it('Should return a users entity with token password and expires after udpated', async () => {
    const userID: string = '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6';
    const passwordToken: string =
      'ed40403fbb606a4cd03f91035db5eb9610de62fb8cd0270f036d1e1250d002dc';
    const expires: any = Date.now() + 60 * 60 * 1000;
    const mockUsers: UserEntity = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      avatarURL: null,
      refreshToken: null,
      tokenPassword: passwordToken,
      tokenPasswordExpires: expires,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.update as jest.Mock).mockResolvedValue(mockUsers);

    const usersUpdated: UserEntity =
      await userService.updateTokenPasswordAndExpires(
        userID,
        passwordToken,
        expires,
      );
    expect(usersUpdated).toBeDefined();
    expect(usersUpdated).toBe(mockUsers);
  });

  it('It should return user entity after updating user password', async () => {
    const userID: string = '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6';
    const mockUsers: UserEntity = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      avatarURL: null,
      refreshToken: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.update as jest.Mock).mockResolvedValue(mockUsers);
    const user: UserEntity = await userService.updateUserPasswordById(
      userID,
      '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
    );
    expect(user).toBeDefined();
    expect(user).toBe(mockUsers);
  });
});
