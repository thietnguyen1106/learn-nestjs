import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { MovieType } from 'src/common/enum/movie-type.enum';

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
  type?: MovieType;
  url: string;
}
