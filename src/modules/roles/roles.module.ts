import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { UsersModule } from '../users/users.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  controllers: [RolesController],
  exports: [TypeOrmModule, RolesService],
  imports: [
    TypeOrmModule.forFeature(),
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
  ],
  providers: [RolesService],
})
export class RolesModule {}
