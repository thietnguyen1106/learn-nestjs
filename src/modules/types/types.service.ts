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
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';
import { Movie } from '../movies/entities/movie.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TypesService {
  private readonly entityUtils: EntityUtils;

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    private readonly dataSource: DataSource,
  ) {
    this.entityUtils = new EntityUtils(this.dataSource);
  }

  async create(createTypeDto: CreateTypeDto, user: User) {
    const { name, description, status, movieIds = [] } = createTypeDto;

    if (name) {
      const checkTypeName = await this.typeRepository.findOne({
        where: { name },
      });
      if (checkTypeName) {
        throw new ConflictException(`Type with name ${name} already exists`);
      }
    }

    const [movies] = await Promise.all([
      this.movieRepository.findBy({ id: In(movieIds) }),
    ]);

    const type = this.typeRepository.create({
      creationUserId: user.id,
      description,
      lastModifiedUserId: user.id,
      movies,
      name,
      status,
    });

    await this.typeRepository.save(type);

    return this.findMultiple([type.id], user);
  }

  async findAll(user: User, isSkipRelations: boolean = false) {
    const relations = this.entityUtils.getRelations({
      entity: Type,
      isSkipRelations,
    });

    const types = await this.typeRepository.find({
      relations,
      where: {
        ...getStatusCondition(user),
      },
    });

    return types;
  }

  async findMultiple(
    ids: UUIDTypes[],
    user: User,
    isSkipRelations: boolean = false,
  ) {
    const relations = this.entityUtils.getRelations({
      entity: Type,
      isSkipRelations,
    });

    const types = await this.typeRepository.find({
      relations,
      where: { id: In(ids), ...getStatusCondition(user) },
    });

    return types;
  }

  async update(id: UUIDTypes, updateTypeDto: UpdateTypeDto, user: User) {
    const {
      name,
      description,
      status,
      movieIds = [],
      movieDeleteIds = [],
    } = updateTypeDto;

    if (name) {
      const checkTypeName = await this.typeRepository.findOne({
        where: { name },
      });
      if (checkTypeName) {
        throw new ConflictException(`Type with name ${name} already exists`);
      }
    }

    const currentType = (await this.findMultiple([id], user))[0];

    if (!currentType) {
      throw new NotFoundException(`Type with id ${id} not found`);
    }

    const [movies] = await Promise.all([
      this.movieRepository.findBy({ id: In(movieIds) }),
    ]);

    const newMovies = currentType.movies
      .filter((movie) => !movieDeleteIds.includes(movie.id))
      .concat(movies);

    const typeUpdated = {
      ...currentType,
      description,
      lastModifiedUserId: user.id,
      movies: newMovies,
      name,
      status,
    };

    await this.typeRepository.save(typeUpdated);

    return this.findMultiple([typeUpdated.id], user);
  }

  async remove(id: UUIDTypes, user: User) {
    return this.update(id, { status: EntityStatus.DELETE }, user);
  }
}
