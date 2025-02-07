import { UUIDTypes } from 'uuid';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @IsUUID('4')
  movieId: UUIDTypes;

  @IsOptional()
  @IsUUID('4')
  parentId?: UUIDTypes;

  @IsUUID('4')
  userId: UUIDTypes;
}
