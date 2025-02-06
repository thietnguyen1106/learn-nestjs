import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  categoryIds?: UUIDTypes[];
  performerIds?: UUIDTypes[];
  topicIds?: UUIDTypes[];
  typeIds?: UUIDTypes[];
}
