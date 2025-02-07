import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateTopicDto } from './create-topic.dto';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {
  @IsOptional()
  @IsUUID('4', { each: true })
  movieDeleteIds?: UUIDTypes[];

  @IsOptional()
  @IsUUID('4', { each: true })
  categoryDeleteIds?: UUIDTypes[];
}
