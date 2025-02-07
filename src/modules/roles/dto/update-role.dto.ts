import { UUIDTypes } from 'uuid';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @IsUUID('4', { each: true })
  userDeleteIds?: UUIDTypes[];

  @IsOptional()
  @IsUUID('4', { each: true })
  permissionDeleteIds?: UUIDTypes[];
}
