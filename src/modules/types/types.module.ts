import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  controllers: [TypesController],
  exports: [TypeOrmModule, TypesService],
  imports: [
    TypeOrmModule.forFeature(),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => MoviesModule),
  ],
  providers: [TypesService],
})
export class TypesModule {}
