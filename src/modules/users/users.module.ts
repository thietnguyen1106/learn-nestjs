import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Movie } from '../movies/entities/movie.entity';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Movie]),
    forwardRef(() => MoviesModule),
    forwardRef(() => PermissionsModule),
    forwardRef(() => RolesModule),
  ],
  providers: [UsersService],
})
export class UsersModule {}
