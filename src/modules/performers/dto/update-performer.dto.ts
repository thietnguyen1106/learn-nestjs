import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { IsOptional, IsUUID } from 'class-validator';
import { CreatePerformerDto } from './create-performer.dto';

export class UpdatePerformerDto extends PartialType(CreatePerformerDto) {
  @IsOptional()
  @IsUUID('4', { each: true })
  movieDeleteIds?: UUIDTypes[];
}
