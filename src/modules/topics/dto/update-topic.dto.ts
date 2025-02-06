import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { CreateTopicDto } from './create-topic.dto';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {
  movieDeleteIds?: UUIDTypes[];
  categoryDeleteIds?: UUIDTypes[];
}
