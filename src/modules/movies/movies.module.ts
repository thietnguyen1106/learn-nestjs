import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { User } from '../users/entities/user.entity';
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
import { Role } from '../roles/entities/role.entity';

@Module({
  controllers: [MoviesController],
  exports: [TypeOrmModule, MoviesService],
  imports: [
    TypeOrmModule.forFeature([
      Movie,
      // User,
      // Role,
      Topic,
      Category,
      // Type,
      // Performer,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => TopicsModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => TypesModule),
    forwardRef(() => PerformersModule),
  ],
  providers: [MoviesService],
})
export class MoviesModule {}
