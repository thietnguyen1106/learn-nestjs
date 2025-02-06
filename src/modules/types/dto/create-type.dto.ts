import { UUIDTypes } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreateTypeDto {
  name: string;
  description?: string;
  status?: EntityStatus;
  movieIds?: UUIDTypes[];
}
