import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [MoviesController],
  exports: [TypeOrmModule, MoviesService],
  imports: [
    TypeOrmModule.forFeature([User, Movie]),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
  ],
  providers: [MoviesService],
})
export class MoviesModule {}
