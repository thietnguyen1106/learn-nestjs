import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MoviesModule } from '../movies/movies.module';
import { TopicsModule } from '../topics/topics.module';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [CategoriesController],
  exports: [TypeOrmModule, CategoriesService],
  imports: [
    TypeOrmModule.forFeature(),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => MoviesModule),
    forwardRef(() => TopicsModule),
  ],
  providers: [CategoriesService],
})
export class CategoriesModule {}
