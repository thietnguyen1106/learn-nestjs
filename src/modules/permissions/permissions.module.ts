import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [PermissionsController],
  exports: [TypeOrmModule, PermissionsService],
  imports: [
    TypeOrmModule.forFeature(),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
  ],
  providers: [PermissionsService],
})
export class PermissionsModule {}
