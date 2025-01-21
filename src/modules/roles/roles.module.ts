import { Module } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
  controllers: [RolesController],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [RolesService],
})
export class RolesModule {}
