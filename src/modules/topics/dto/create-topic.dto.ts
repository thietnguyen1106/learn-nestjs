import { UUIDTypes } from 'uuid';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreateTopicDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  movieIds?: UUIDTypes[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: UUIDTypes[];
}
