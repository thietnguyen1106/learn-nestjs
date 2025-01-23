import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [PermissionsController],
  exports: [TypeOrmModule, PermissionsService],
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
  ],
  providers: [PermissionsService],
})
export class PermissionsModule {}
