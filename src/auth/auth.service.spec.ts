import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './DTOs';
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    service = new AuthService(
      new UserService(new PrismaService()),
      new JwtService(),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a access token and refresh token', async () => {
    const id: string = '0bea6fd5-c889-4e3e-9998-ee87f6656878';
    const accessToken: string = await service.generateAccessToken(id);
    const refreshToken: string = await service.generateRefreshToken(id);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('Should return a user when success validate', async () => {
    const dto: AuthDto = {
      email: 'danar@gmail.com',
      password: '12345678',
    };
    jest
      .spyOn(service, 'validate')
      .mockImplementation(async () => '0bea6fd5-c889-4e3e-9998-ee87f6656878');
    expect(await service.validate(dto)).toBeTruthy();
  });
  it('Should return a false when email incorrect', async () => {
    const dto: AuthDto = {
      email: 'danar1212eww@gmail.com',
      password: '12345678',
    };
    jest.spyOn(service, 'validate').mockImplementation(async () => false);
    expect(await service.validate(dto)).toBeFalsy();
  });
  it('Should return a false when password incorrect', async () => {
    const dto: AuthDto = {
      email: 'danargmail.com',
      password: '12345678anjayq9jdj',
    };
    jest.spyOn(service, 'validate').mockImplementation(async () => false);
    expect(await service.validate(dto)).toBeFalsy();
  });
});
