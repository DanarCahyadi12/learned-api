import { IsArray, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
export class UpdateMaterialDto {
  @IsNotEmpty()
  @MaxLength(191)
  title: string;
  @IsOptional()
  @MaxLength(500)
  description: string;
  @IsOptional()
  @IsArray()
  deleteFiles?: string[];
}
