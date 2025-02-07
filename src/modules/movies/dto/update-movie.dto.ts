import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsOptional()
  @IsUUID('4', { each: true })
  categoryIds?: UUIDTypes[];

  @IsOptional()
  @IsUUID('4', { each: true })
  performerIds?: UUIDTypes[];

  @IsOptional()
  @IsUUID('4', { each: true })
  topicIds?: UUIDTypes[];

  @IsOptional()
  @IsUUID('4', { each: true })
  typeIds?: UUIDTypes[];
}
