import { IsNotEmpty, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @Length(0, 255)
  name: string;
  @Length(0, 16777215)
  bio: string;
}
