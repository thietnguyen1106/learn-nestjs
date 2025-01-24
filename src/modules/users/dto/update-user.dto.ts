import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  roleDeleteIds?: UUIDTypes[];
  permissionDeleteIds?: UUIDTypes[];
}
