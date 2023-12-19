import { IsOptional } from 'class-validator';

export class PostStudentAssignmentDto {
  @IsOptional()
  url?: string;
}
