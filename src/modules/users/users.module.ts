import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
  controllers: [UsersController],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [UsersService],
})
export class UsersModule {}
