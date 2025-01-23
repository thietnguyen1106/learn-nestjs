import { Not } from 'typeorm';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { PERMISSION_AUTH } from 'src/config/permission';
import { User } from 'src/modules/users/entities/user.entity';

export const getStatusCondition = (user: User) => {
  return {
    ...(user.permissions.every(
      (permission) => permission.code !== PERMISSION_AUTH.ALL,
    ) && { status: Not(EntityStatus.DELETE) }),
  };
};
