import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { UUIDTypes } from 'uuid';

export class CreateCommentDto {
  content: string;
  status?: EntityStatus;
  movieId: UUIDTypes;
  parentId: UUIDTypes;
  userId: UUIDTypes;
}
