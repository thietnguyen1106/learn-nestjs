import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  controllers: [CommentsController],
  exports: [TypeOrmModule, CommentsService],
  imports: [
    TypeOrmModule.forFeature(),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => MoviesModule),
  ],
  providers: [CommentsService],
})
export class CommentsModule {}
