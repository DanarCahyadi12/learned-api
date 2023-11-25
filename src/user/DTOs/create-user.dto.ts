import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class createUserDto {
  @IsNotEmpty()
  @Length(0, 255)
  name: string;
  @IsEmail()
  @Length(0, 255)
  email: string;
  password?: string;
  avatarURL?: string;
}
