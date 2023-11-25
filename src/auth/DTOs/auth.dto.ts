import { IsNotEmpty, Length } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @Length(0, 255)
  email: string;
  @IsNotEmpty()
  @Length(0, 16777215)
  password: string;
}
