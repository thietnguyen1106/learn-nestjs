import * as fs from 'fs';
import { Request, Response } from 'express';
import { DataSource, In, Repository } from 'typeorm';
import { UUIDTypes } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { getStatusCondition } from 'src/utils/getStatusCondition';
import { EntityUtils } from 'src/common/utils/entity.utils';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { User } from '../users/entities/user.entity';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private readonly entityUtils: EntityUtils;

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly dataSource: DataSource,
  ) {
    this.entityUtils = new EntityUtils(this.dataSource);
  }

  async create(createMovieDto: CreateMovieDto, user: User) {
    const {
      description,
      director,
      origin,
      posterUrl,
      rating,
      releaseDate,
      status,
      subTitle,
      title,
      url,
    } = createMovieDto;

    const movie = this.movieRepository.create({
      creationUserId: user.id,
      description,
      director,
      lastModifiedUserId: user.id,
      origin,
      posterUrl,
      rating,
      releaseDate,
      status,
      subTitle,
      title,
      url,
    });

    await this.movieRepository.save(movie);

    return this.findMultiple([movie.id], user);
  }

  async findAll(user: User, isSkipRelations: boolean = false) {
    const relations = this.entityUtils.getRelations({
      entity: Movie,
      isSkipRelations,
    });

    const movies = await this.movieRepository.find({
      relations,
      where: {
        ...getStatusCondition(user),
      },
    });

    return movies;
  }

  async findMultiple(
    ids: UUIDTypes[],
    user: User,
    isSkipRelations: boolean = false,
  ) {
    const relations = this.entityUtils.getRelations({
      entity: Movie,
      isSkipRelations,
    });

    const movies = await this.movieRepository.find({
      relations,
      where: {
        id: In(ids),
        ...getStatusCondition(user),
      },
    });

    return movies;
  }

  async update(id: UUIDTypes, updateMovieDto: UpdateMovieDto, user: User) {
    const {
      description,
      director,
      origin,
      posterUrl,
      rating,
      releaseDate,
      status,
      subTitle,
      title,
      url,
    } = updateMovieDto;

    const currentMovie = (await this.findMultiple([id], user))[0];
    if (!currentMovie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    const movieUpdated = {
      ...currentMovie,
      description,
      director,
      lastModifiedUserId: user.id,
      origin,
      posterUrl,
      rating,
      releaseDate,
      status,
      subTitle,
      title,
      url,
    };

    await this.movieRepository.save(movieUpdated);

    return this.findMultiple([movieUpdated.id], user);
  }

  async remove(id: UUIDTypes, user: User) {
    return this.update(id, { status: EntityStatus.DELETE }, user);
  }

  async streamMovie(id: string, req: Request, res: Response) {
    // const isProduction = process.env.NODE_ENV === 'production';
    // const videosPath = isProduction
    //   ? path.join(__dirname, '..', '..', 'assets', 'videos')
    //   : path.join(__dirname, '..', '..', '..', 'src', 'assets', 'videos');
    const movie = (await this.findMultiple([id], null))[0];

    if (!movie) {
      throw new NotFoundException('Movie is not found');
    }

    const videoPath = movie.url;
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res
          .status(416)
          .send(
            'Requested range not satisfiable\n' + start + ' >= ' + fileSize,
          );
        return;
      }

      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { end, start });
      const head = {
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  }
}
