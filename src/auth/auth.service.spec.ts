import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { GoogleOauthService } from '../google-oauth/google-oauth.service';
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
