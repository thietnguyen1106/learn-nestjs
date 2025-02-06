import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformersService } from './performers.service';
import { PerformersController } from './performers.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  controllers: [PerformersController],
  exports: [TypeOrmModule, PerformersService],
  imports: [
    TypeOrmModule.forFeature(),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => MoviesModule),
  ],
  providers: [PerformersService],
})
export class PerformersModule {}
