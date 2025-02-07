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
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Movie } from '../movies/entities/movie.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  private readonly entityUtils: EntityUtils;

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {
    this.entityUtils = new EntityUtils(this.dataSource);
  }

  async create(createCommentDto: CreateCommentDto, user: User) {
    const { content, status, movieId, parentId, userId } = createCommentDto;

    const [movie, parentComment, userComment] = await Promise.all([
      this.movieRepository.findOne({ where: { id: movieId } }),
      parentId
        ? this.commentRepository.findOne({
            relations: ['movie'],
            where: { id: parentId },
          })
        : null,
      this.userRepository.findOne({ where: { id: userId } }),
    ]);

    if (!movie) {
      throw new NotFoundException(`Movie with id ${movieId} not found`);
    }

    if (!userComment) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (parentComment && parentComment?.movie?.id !== movie.id) {
      throw new NotFoundException(
        `Comment with id ${parentId} not found in movie with id ${movieId}`,
      );
    }

    if (parentComment?.lever >= 2) {
      throw new ConflictException('Cannot reply to comments with level >= 2');
    }

    const comment = this.commentRepository.create({
      content,
      creationUserId: user.id,
      lastModifiedUserId: user.id,
      lever: parentComment ? parentComment.lever + 1 : 0,
      movie,
      parent: parentComment,
      status,
      user: userComment,
    });

    await this.commentRepository.save(comment);

    return this.findMultiple([comment.id], user);
  }

  async findAll(user: User, isSkipRelations: boolean = false) {
    const relations = this.entityUtils.getRelations({
      entity: Comment,
      isSkipRelations,
    });

    const comments = await this.commentRepository.find({
      relations,
      where: {
        ...getStatusCondition(user),
        lever: 0,
      },
    });

    return comments;
  }

  async findMultiple(
    ids: UUIDTypes[],
    user: User,
    isSkipRelations: boolean = false,
  ) {
    const relations = this.entityUtils.getRelations({
      entity: Comment,
      isSkipRelations,
    });

    const comments = await this.commentRepository.find({
      relations,
      where: { id: In(ids), ...getStatusCondition(user) },
    });

    return comments;
  }

  async update(id: UUIDTypes, updateCommentDto: UpdateCommentDto, user: User) {
    const { content, status } = updateCommentDto;

    const currentComment = (await this.findMultiple([id], user))[0];

    if (!currentComment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    const commentUpdated = {
      ...currentComment,
      content,
      lastModifiedUserId: user.id,
      status,
    };

    await this.commentRepository.save(commentUpdated);

    return this.findMultiple([commentUpdated.id], user);
  }

  async remove(id: UUIDTypes, user: User) {
    return this.update(id, { status: EntityStatus.DELETE }, user);
  }
}
