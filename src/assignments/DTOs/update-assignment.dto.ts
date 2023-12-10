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
import { DeleteAttachmentDto } from './delete-attachment.dto';
export class UpdateAssignmentDto {
  @IsNotEmpty()
  @MaxLength(191)
  title: string;

  @IsOptional()
  @MaxLength(255)
  @ValidateIf((object: UpdateAssignmentDto) => object.description !== undefined)
  description?: string;

  @IsOptional()
  @ValidateIf((object: UpdateAssignmentDto) => object.openedAt !== undefined)
  @MinDate(new Date())
  openedAt?: Date;

  @IsOptional()
  @ValidateIf((object: UpdateAssignmentDto) => object.closedAt !== undefined)
  @MinDate(new Date())
  closedAt?: Date;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  passGrade?: number;
  allowSeeGrade?: boolean;
  @ValidateIf((object: UpdateAssignmentDto) =>
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
  deleteAttachments?: DeleteAttachmentDto[];
}
