import { IsNotEmpty, MaxLength } from 'class-validator';

export class JoinClassroomDto {
  @IsNotEmpty()
  @MaxLength(6)
  code: string;
}
