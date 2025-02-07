import { PartialType } from '@nestjs/mapped-types';
import { UUIDTypes } from 'uuid';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateTypeDto } from './create-type.dto';

export class UpdateTypeDto extends PartialType(CreateTypeDto) {
  @IsOptional()
  @IsUUID('4', { each: true })
  movieDeleteIds?: UUIDTypes[];
}
