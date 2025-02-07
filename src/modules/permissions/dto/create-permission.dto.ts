import { UUIDTypes } from 'uuid';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreatePermissionDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds?: UUIDTypes[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds?: UUIDTypes[];
}
