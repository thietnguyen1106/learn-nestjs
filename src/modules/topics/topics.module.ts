import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { MoviesModule } from '../movies/movies.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  controllers: [TopicsController],
  exports: [TypeOrmModule, TopicsService],
  imports: [
    TypeOrmModule.forFeature(),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => MoviesModule),
    forwardRef(() => CategoriesModule),
  ],
  providers: [TopicsService],
})
export class TopicsModule {}
