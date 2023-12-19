import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
  MinDate,
  IsOptional,
  ValidateIf,
  IsInt,
} from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @MaxLength(191)
  title: string;

  @IsOptional()
  @MaxLength(255)
  @ValidateIf((object: CreateAssignmentDto) => object.description !== undefined)
  description?: string;

  @IsOptional()
  @ValidateIf((object: CreateAssignmentDto) => object.openedAt !== undefined)
  @MinDate(new Date())
  openedAt?: Date;

  @IsOptional()
  @ValidateIf((object: CreateAssignmentDto) => object.dueAt !== undefined)
  @MinDate(new Date())
  dueAt?: Date;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  passGrade?: number;
  allowSeeGrade?: boolean;
  @ValidateIf((object: CreateAssignmentDto) =>
    object.extensions.some(
      (ext) =>
        ext === '.jpg' ||
        ext === '.png' ||
        ext === '.jpeg' ||
        ext === '.docx' ||
        ext === '.xlxs' ||
        ext === '.ppt' ||
        ext === '.pdf',
    ),
  )
  extensions: string[];
}
