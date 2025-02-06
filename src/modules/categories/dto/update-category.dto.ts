import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  movieDeleteIds?: UUIDTypes[];
  topicDeleteIds?: UUIDTypes[];
}
