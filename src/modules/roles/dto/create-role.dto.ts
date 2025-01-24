import { UUIDTypes } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreateRoleDto {
  description?: string;
  name: string;
  status?: EntityStatus;
  userIds?: UUIDTypes[];
  permissionIds?: UUIDTypes[];
}
