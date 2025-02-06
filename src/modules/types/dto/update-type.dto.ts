import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { CreateTypeDto } from './create-type.dto';

export class UpdateTypeDto extends PartialType(CreateTypeDto) {
  movieDeleteIds?: UUIDTypes[];
}
