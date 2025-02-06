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
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Category } from '../categories/entities/category.entity';
import { Topic } from './entities/topic.entity';
import { Movie } from '../movies/entities/movie.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TopicsService {
  private readonly entityUtils: EntityUtils;

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource,
  ) {
    this.entityUtils = new EntityUtils(this.dataSource);
  }

  async create(createTopicDto: CreateTopicDto, user: User) {
    const {
      name,
      description,
      status,
      movieIds = [],
      categoryIds = [],
    } = createTopicDto;

    if (name) {
      const checkTopicName = await this.topicRepository.findOne({
        where: { name },
      });
      if (checkTopicName) {
        throw new ConflictException(`Topic with name ${name} already exists`);
      }
    }

    const [movies, categories] = await Promise.all([
      this.movieRepository.findBy({ id: In(movieIds) }),
      this.topicRepository.findBy({ id: In(categoryIds) }),
    ]);

    const topic = this.topicRepository.create({
      categories,
      creationUserId: user.id,
      description,
      lastModifiedUserId: user.id,
      movies,
      name,
      status,
    });

    await this.topicRepository.save(topic);

    return this.findMultiple([topic.id], user);
  }

  async findAll(user: User, isSkipRelations: boolean = false) {
    const relations = this.entityUtils.getRelations({
      entity: Topic,
      isSkipRelations,
    });

    const topics = await this.topicRepository.find({
      relations,
      where: {
        ...getStatusCondition(user),
      },
    });

    return topics;
  }

  async findMultiple(
    ids: UUIDTypes[],
    user: User,
    isSkipRelations: boolean = false,
  ) {
    const relations = this.entityUtils.getRelations({
      entity: Topic,
      isSkipRelations,
    });

    const topics = await this.topicRepository.find({
      relations,
      where: { id: In(ids), ...getStatusCondition(user) },
    });

    return topics;
  }

  async update(id: UUIDTypes, updateTopicDto: UpdateTopicDto, user: User) {
    const {
      name,
      description,
      status,
      movieIds = [],
      movieDeleteIds = [],
      categoryIds = [],
      categoryDeleteIds = [],
    } = updateTopicDto;

    if (name) {
      const checkTopicName = await this.topicRepository.findOne({
        where: { name },
      });
      if (checkTopicName) {
        throw new ConflictException(`Topic with name ${name} already exists`);
      }
    }

    const currentTopic = (await this.findMultiple([id], user))[0];

    if (!currentTopic) {
      throw new NotFoundException(`Topic with id ${id} not found`);
    }

    const [movies, categories] = await Promise.all([
      this.movieRepository.findBy({ id: In(movieIds) }),
      this.categoryRepository.findBy({ id: In(categoryIds) }),
    ]);

    const newMovies = currentTopic.movies
      .filter((movie) => !movieDeleteIds.includes(movie.id))
      .concat(movies);
    const newCategories = currentTopic.categories
      .filter((topic) => !categoryDeleteIds.includes(topic.id))
      .concat(categories);

    const topicUpdated = {
      ...currentTopic,
      categories: newCategories,
      description,
      lastModifiedUserId: user.id,
      movies: newMovies,
      name,
      status,
    };

    await this.topicRepository.save(topicUpdated);

    return this.findMultiple([topicUpdated.id], user);
  }

  async remove(id: UUIDTypes, user: User) {
    return this.update(id, { status: EntityStatus.DELETE }, user);
  }
}
