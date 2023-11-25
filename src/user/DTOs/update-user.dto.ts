import { IsNotEmpty, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(0, 255)
  name: string;
  @IsNotEmpty()
  @Length(0, 16777215)
  bio: string;
}
