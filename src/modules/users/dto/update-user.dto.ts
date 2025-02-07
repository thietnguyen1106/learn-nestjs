import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsUUID('4', { each: true })
  roleDeleteIds?: UUIDTypes[];

  @IsOptional()
  @IsUUID('4', { each: true })
  permissionDeleteIds?: UUIDTypes[];
}
