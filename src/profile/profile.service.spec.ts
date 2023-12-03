import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaMock, prismaMock } from '../prisma/prisma.mock';
import { ProfileResponse } from './interfaces/profile-response.interface';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UpdateProfileDto } from './DTOs';
import { UserEntity } from '../user/entity';
import { UpdateProfileResponse } from './interfaces';
describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
      providers: [
        ProfileService,
        {
          provide: PrismaMock,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('It should return valid response and profile data', async () => {
    const expectedResponse: ProfileResponse = {
      status: 'success',
      message: 'Get profile successfully',
      data: {
        id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
        name: 'I Ketut Danar Cahyadi',
        avatarURL: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    const userMock = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danarcahyadi@gmail.com',
      password: null,
      avatarURL: null,
      refreshToken: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.findUnique as jest.Mock).mockResolvedValue(userMock);
    const response = await service.getProfile(
      'cdfe9601-dfb2-4708-9449-f36e446e1b11',
    );
    expect(response).toEqual(expectedResponse);
  });
  it('It Should return a valid user payload after updated', async () => {
    const userID: string = '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6';
    const dto: UpdateProfileDto = {
      name: 'I Made Jentaka',
      bio: 'This is bio',
    };
    const mockUsers: UserEntity = {
      id: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      name: 'I Made Jentaka',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      avatarURL: 'http://localhost:3000/public/images/avatars/image.jpg',
      refreshToken: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
      bio: 'This is bio',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const picture: string = 'image.jpg';
    const expectedResult: UpdateProfileResponse = {
      status: 'success',
      message: 'Profile updated!',
      data: {
        id: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
        avatarURL: 'http://localhost:3000/public/images/avatars/image.jpg',
        name: 'I Made Jentaka',
        bio: 'This is bio',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    (prismaMock.users.update as jest.Mock).mockResolvedValue(mockUsers);
    const result = await service.updateProfile(userID, picture, dto);
    expect(result).toEqual(expectedResult);
  });

  it('Should return splited avatar url', async () => {
    const path = service.splitAvatarUrl(
      'http://localhost:8000/public/images/avatars/image.jpg',
    );
    expect(path).toBe('public/images/avatars/image.jpg');
  });

  it('Should return a public avatar path', async () => {
    const mockUsers: UserEntity = {
      id: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      name: 'I Made Jentaka',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      avatarURL: 'http://localhost:3000/public/images/avatars/image.jpg',
      refreshToken: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
      bio: 'This is bio',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.findUnique as jest.Mock).mockResolvedValue(mockUsers);
    const path = await service.getAvatarPath(
      'http://localhost:8000/public/images/avatars/image.jpg',
    );
    expect(path).toBe('public/images/avatars/image.jpg');
  });

  it('Should return valid response with updating avatar', async () => {
    const mockUsers: UserEntity = {
      id: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      name: 'I Made Jentaka',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      avatarURL: 'http://localhost:3000/public/images/avatars/image.jpg',
      refreshToken: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
      bio: 'This is bio',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.update as jest.Mock).mockResolvedValue(mockUsers);
    const dto: UpdateProfileDto = {
      name: 'I Made Jentaka',
      bio: 'This is bio',
    };
    const expectedResult: UpdateProfileResponse = {
      status: 'success',
      message: 'Profile updated!',
      data: {
        id: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
        name: 'I Made Jentaka',
        avatarURL: 'http://localhost:3000/public/images/avatars/image.jpg',
        bio: 'This is bio',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const result: UpdateProfileResponse = await service.updateProfile(
      '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      'image.jpg',
      dto,
    );
    expect(result).toEqual(expectedResult);
  });
  it('Should return valid response without updating avatar', async () => {
    const mockUsers: UserEntity = {
      id: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      name: 'I Made Jentaka',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      avatarURL: 'http://localhost:3000/public/images/avatars/image.jpg',
      refreshToken: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
      bio: 'This is bio',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prismaMock.users.update as jest.Mock).mockResolvedValue(mockUsers);
    const dto: UpdateProfileDto = {
      name: 'I Made Jentaka',
      bio: 'This is bio',
    };
    const expectedResult: UpdateProfileResponse = {
      status: 'success',
      message: 'Profile updated!',
      data: {
        id: '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
        name: 'I Made Jentaka',
        avatarURL: 'http://localhost:3000/public/images/avatars/image.jpg',
        bio: 'This is bio',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const result: UpdateProfileResponse = await service.updateProfile(
      '41c3fb5c-220e-4ae5-948c-3cd1ab7e84b6',
      null,
      dto,
    );
    expect(result).toEqual(expectedResult);
  });
});
