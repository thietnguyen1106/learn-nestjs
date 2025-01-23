import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    forwardRef(() => RolesModule),
    forwardRef(() => PermissionsModule),
  ],
  providers: [UsersService],
})
export class UsersModule {}
