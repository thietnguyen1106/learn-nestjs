import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { UUIDTypes } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { getStatusCondition } from 'src/utils/getStatusCondition';
import { EntityUtils } from 'src/common/utils/entity.utils';
import { CreatePerformerDto } from './dto/create-performer.dto';
import { UpdatePerformerDto } from './dto/update-performer.dto';
import { Performer } from './entities/performer.entity';
import { Movie } from '../movies/entities/movie.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PerformersService {
  private readonly entityUtils: EntityUtils;

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Performer)
    private readonly performerRepository: Repository<Performer>,
    private readonly dataSource: DataSource,
  ) {
    this.entityUtils = new EntityUtils(this.dataSource);
  }

  async create(createPerformerDto: CreatePerformerDto, user: User) {
    const {
      name,
      avatarUrl,
      gender,
      dateOfBirth,
      nation,
      biography,
      link,
      status,
      movieIds = [],
    } = createPerformerDto;

    if (name) {
      const checkPerformerName = await this.performerRepository.findOne({
        where: { name },
      });
      if (checkPerformerName) {
        throw new ConflictException(
          `Performer with name ${name} already exists`,
        );
      }
    }

    const [movies] = await Promise.all([
      this.movieRepository.findBy({ id: In(movieIds) }),
    ]);

    const performer = this.performerRepository.create({
      avatarUrl,
      biography,
      creationUserId: user.id,
      dateOfBirth,
      gender,
      lastModifiedUserId: user.id,
      link,
      movies,
      name,
      nation,
      status,
    });

    await this.performerRepository.save(performer);

    return this.findMultiple([performer.id], user);
  }

  async findAll(user: User, isSkipRelations: boolean = false) {
    const relations = this.entityUtils.getRelations({
      entity: Performer,
      isSkipRelations,
    });

    const performers = await this.performerRepository.find({
      relations,
      where: {
        ...getStatusCondition(user),
      },
    });

    return performers;
  }

  async findMultiple(
    ids: UUIDTypes[],
    user: User,
    isSkipRelations: boolean = false,
  ) {
    const relations = this.entityUtils.getRelations({
      entity: Performer,
      isSkipRelations,
    });

    const performers = await this.performerRepository.find({
      relations,
      where: { id: In(ids), ...getStatusCondition(user) },
    });

    return performers;
  }

  async update(
    id: UUIDTypes,
    updatePerformerDto: UpdatePerformerDto,
    user: User,
  ) {
    const {
      name,
      avatarUrl,
      gender,
      dateOfBirth,
      nation,
      biography,
      link,
      status,
      movieIds = [],
      movieDeleteIds = [],
    } = updatePerformerDto;

    if (name) {
      const checkPerformerName = await this.performerRepository.findOne({
        where: { name },
      });
      if (checkPerformerName) {
        throw new ConflictException(
          `Performer with name ${name} already exists`,
        );
      }
    }

    const currentPerformer = (await this.findMultiple([id], user))[0];

    if (!currentPerformer) {
      throw new NotFoundException(`Performer with id ${id} not found`);
    }

    const [movies] = await Promise.all([
      this.movieRepository.findBy({ id: In(movieIds) }),
    ]);

    const newMovies = currentPerformer.movies
      .filter((movie) => !movieDeleteIds.includes(movie.id))
      .concat(movies);

    const performerUpdated = {
      ...currentPerformer,
      avatarUrl,
      biography,
      dateOfBirth,
      gender,
      lastModifiedUserId: user.id,
      link,
      movies: newMovies,
      name,
      nation,
      status,
    };

    await this.performerRepository.save(performerUpdated);

    return this.findMultiple([performerUpdated.id], user);
  }

  async remove(id: UUIDTypes, user: User) {
    return this.update(id, { status: EntityStatus.DELETE }, user);
  }
}
