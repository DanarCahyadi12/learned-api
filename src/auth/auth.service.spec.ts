import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './DTOs';
import { MailService } from 'src/mail/mail.service';
import { GoogleOauthService } from 'src/google-oauth/google-oauth.service';
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    service = new AuthService(
      new UserService(new PrismaService()),
      new JwtService(),
      new MailService(new GoogleOauthService()),
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
    const user = {
      id: 'cdfe9601-dfb2-4708-9449-f36e446e1b11',
      name: 'I Ketut Danar Cahyadi',
      email: 'danar@gmail.com',
      password: '$2a$10$6URsw55BPivQdveiLezwa.e7JyB5YzGJ3/PWPcd7yMVWOglgs6S6i',
      pictureURL: null,
      refreshToken: null,
      tokenPassword: null,
      tokenPasswordExpires: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(service, 'validate').mockImplementation(async () => user);
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

  it('Should return true when compare valid refresh token', async () => {
    const rf: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MWMzZmI1Yy0yMjBlLTRhZTUtOTQ4Yy0zY2QxYWI3ZTg0YjYiLCJpYXQiOjE3MDAwMjM3NzMsImV4cCI6MTcwMDI4Mjk3M30.4Of7FH6l7e-wJhKr5z3CdiKwmMf3IvdAZPrG2TC5ln0';
    const hashedRf: string =
      '$2b$10$gmRdcNHeBDfYHNEkyR7iAul1sVSzT5gfi4j1SRGkzAn73d.pFqWyu';
    expect(await service.validateRefreshToken(rf, hashedRf)).toBeTruthy();
  });
  it('Should return false when compare invalid refresh token', async () => {
    const rf: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJasa9.eyJzdWIiOiI0MWMzZmI1Yy0yMjBlLTRhZTUtOTQ4Yy0zY2QxYWI3ZTg0YjYiLCJpYXQiOjE3MDAwMjM3NzMsImV4cCI6MTcwMDI4Mjk3M30.4Of7FH6l7e-wJhKr5z3CdiKwmMf3IvdAZPrG2TC5ln0';
    const hashedRf: string =
      '$2b$10$gmRdcNHeBDfYHNEkyR7iAul1sVSzT5gfi4j1SRGkzAn73d.pFqWyu';
    expect(await service.validateRefreshToken(rf, hashedRf)).toBeFalsy();
  });
});
