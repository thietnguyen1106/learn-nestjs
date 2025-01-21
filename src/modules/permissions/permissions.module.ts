import { Module } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  controllers: [PermissionsController],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [PermissionsService],
})
export class PermissionsModule {}
