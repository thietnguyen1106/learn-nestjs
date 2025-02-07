import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsUUID('4', { each: true })
  movieDeleteIds?: UUIDTypes[];

  @IsOptional()
  @IsUUID('4', { each: true })
  topicDeleteIds?: UUIDTypes[];
}
