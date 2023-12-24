import { IsNotEmpty, Length } from 'class-validator';

export class ClassroomDto {
  @IsNotEmpty()
  @Length(0, 255)
  name: string;
  @Length(0, 4294967295)
  description: string;
}
