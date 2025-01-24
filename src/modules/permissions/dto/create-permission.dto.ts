import { UUIDTypes } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreatePermissionDto {
  code: string;
  description: string;
  name?: string;
  status?: EntityStatus;
  userIds?: UUIDTypes[];
  roleIds?: UUIDTypes[];
}
