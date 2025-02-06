import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { CreatePerformerDto } from './create-performer.dto';

export class UpdatePerformerDto extends PartialType(CreatePerformerDto) {
  movieDeleteIds?: UUIDTypes[];
}
