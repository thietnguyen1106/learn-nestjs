import { forwardRef, Module } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { UsersModule } from '../users/users.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  controllers: [RolesController],
  exports: [TypeOrmModule, RolesService],
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
  ],
  providers: [RolesService],
})
export class RolesModule {}
