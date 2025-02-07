import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { UsersModule } from '../users/users.module';
import { Topic } from '../topics/entities/topic.entity';
import { Category } from '../categories/entities/category.entity';
import { Type } from '../types/entities/type.entity';
import { Performer } from '../performers/entities/performer.entity';
import { CategoriesModule } from '../categories/categories.module';
import { TypesModule } from '../types/types.module';
import { PerformersModule } from '../performers/performers.module';
import { TopicsModule } from '../topics/topics.module';
import { RolesModule } from '../roles/roles.module';
import { CommentsModule } from '../comments/comments.module';
import { Comment } from '../comments/entities/comment.entity';

@Module({
  controllers: [MoviesController],
  exports: [TypeOrmModule, MoviesService],
  imports: [
    TypeOrmModule.forFeature([
      Movie,
      Topic,
      Category,
      Type,
      Performer,
      Comment,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => TopicsModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => TypesModule),
    forwardRef(() => PerformersModule),
    forwardRef(() => CommentsModule),
  ],
  providers: [MoviesService],
})
export class MoviesModule {}
