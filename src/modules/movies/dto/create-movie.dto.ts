import { UUIDTypes } from 'uuid';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreateMovieDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsDate()
  releaseDate?: Date;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @IsOptional()
  @IsString()
  subTitle?: string;

  @IsString()
  title: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: UUIDTypes[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  topicIds?: UUIDTypes[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  typeIds?: UUIDTypes[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  performerIds?: UUIDTypes[];
}
