import { IsNotEmpty, Length } from 'class-validator';

export class SetPasswordDto {
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
  @IsNotEmpty()
  @Length(8, 255)
  passwordConfirm: string;
}
