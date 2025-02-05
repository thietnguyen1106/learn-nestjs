import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreateMovieDto {
  description?: string;
  director?: string;
  origin?: string;
  posterUrl?: string;
  rating?: number;
  releaseDate?: Date;
  status?: EntityStatus;
  subTitle?: string;
  title: string;
  url: string;
}
