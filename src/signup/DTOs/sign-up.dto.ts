import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @Length(0, 255)
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
