import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  userDeleteIds?: UUIDTypes[];
  roleDeleteIds?: UUIDTypes[];
}
