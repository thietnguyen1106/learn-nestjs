import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { IsOptional, IsUUID } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsOptional()
  @IsUUID('4', { each: true })
  userDeleteIds?: UUIDTypes[];

  @IsOptional()
  @IsUUID('4', { each: true })
  roleDeleteIds?: UUIDTypes[];
}
