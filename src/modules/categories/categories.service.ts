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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Topic } from '../topics/entities/topic.entity';
import { Movie } from '../movies/entities/movie.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CategoriesService {
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

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const {
      name,
      description,
      status,
      movieIds = [],
      topicIds = [],
    } = createCategoryDto;

    if (name) {
      const checkCategoryName = await this.categoryRepository.findOne({
        where: { name },
      });
      if (checkCategoryName) {
        throw new ConflictException(
          `Category with name ${name} already exists`,
        );
      }
    }

    const [movies, topics] = await Promise.all([
      this.movieRepository.findBy({ id: In(movieIds) }),
      this.topicRepository.findBy({ id: In(topicIds) }),
    ]);

    const category = this.categoryRepository.create({
      creationUserId: user.id,
      description,
      lastModifiedUserId: user.id,
      movies,
      name,
      status,
      topics,
    });

    await this.categoryRepository.save(category);

    return this.findMultiple([category.id], user);
  }

  async findAll(user: User, isSkipRelations: boolean = false) {
    const relations = this.entityUtils.getRelations({
      entity: Category,
      isSkipRelations,
    });

    const categories = await this.categoryRepository.find({
      relations,
      where: {
        ...getStatusCondition(user),
      },
    });

    return categories;
  }

  async findMultiple(
    ids: UUIDTypes[],
    user: User,
    isSkipRelations: boolean = false,
  ) {
    const relations = this.entityUtils.getRelations({
      entity: Category,
      isSkipRelations,
    });

    const categories = await this.categoryRepository.find({
      relations,
      where: { id: In(ids), ...getStatusCondition(user) },
    });

    return categories;
  }

  async update(
    id: UUIDTypes,
    updateCategoryDto: UpdateCategoryDto,
    user: User,
  ) {
    const {
      name,
      description,
      status,
      movieIds = [],
      movieDeleteIds = [],
      topicIds = [],
      topicDeleteIds = [],
    } = updateCategoryDto;

    if (name) {
      const checkCategoryName = await this.categoryRepository.findOne({
        where: { name },
      });
      if (checkCategoryName) {
        throw new ConflictException(
          `Category with name ${name} already exists`,
        );
      }
    }

    const currentCategory = (await this.findMultiple([id], user))[0];

    if (!currentCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const [movies, topics] = await Promise.all([
      this.movieRepository.findBy({ id: In(movieIds) }),
      this.topicRepository.findBy({ id: In(topicIds) }),
    ]);

    const newMovies = currentCategory.movies
      .filter((movie) => !movieDeleteIds.includes(movie.id))
      .concat(movies);
    const newTopics = currentCategory.topics
      .filter((topic) => !topicDeleteIds.includes(topic.id))
      .concat(topics);

    const categoryUpdated = {
      ...currentCategory,
      description,
      lastModifiedUserId: user.id,
      movies: newMovies,
      name,
      status,
      topics: newTopics,
    };

    await this.categoryRepository.save(categoryUpdated);

    return this.findMultiple([categoryUpdated.id], user);
  }

  async remove(id: UUIDTypes, user: User) {
    return this.update(id, { status: EntityStatus.DELETE }, user);
  }
}
