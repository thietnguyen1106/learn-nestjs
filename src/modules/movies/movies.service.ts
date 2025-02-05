import * as fs from 'fs';
import { Request, Response } from 'express';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { getStatusCondition } from 'src/utils/getStatusCondition';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { User } from '../users/entities/user.entity';
import { Movie } from './entities/movie.entity';
import { UUIDTypes } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

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
      type,
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
      type,
      url,
    });

    await this.movieRepository.save(movie);

    return this.findMultiple([movie.id], user);
  }

  async findAll(user: User) {
    const movies = await this.movieRepository.find({
      where: {
        ...getStatusCondition(user),
      },
    });

    return movies;
  }

  async findMultiple(ids: UUIDTypes[], user: User) {
    const movies = await this.movieRepository.find({
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
      type,
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
      type,
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

    const videoPath = movie.url;
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const range = req.headers.range;

    if (false) {
      const video = fs.readFileSync(videoPath); // Đọc toàn bộ nội dung file

      // Thiết lập các headers để trả về video
      res.set({
        'Content-Type': 'video/mp4',
        // 'Content-Disposition': 'inline; filename="sample.mp4"',
        'Content-Length': video.length, // Cung cấp chiều dài của video
      });
  
      // Trả về nội dung của video
      res.send(video);

      return;
    }

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
      const file = fs.createReadStream(videoPath, { start, end });
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
