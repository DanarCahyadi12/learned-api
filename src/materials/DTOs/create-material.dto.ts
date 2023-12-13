import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMaterialDto {
  @IsNotEmpty()
  @MaxLength(191)
  title: string;
  @IsOptional()
  @MaxLength(500)
  description: string;
}
