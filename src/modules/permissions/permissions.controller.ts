import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UUIDTypes } from 'uuid';
import { PERMISSION_AUTH } from 'src/config/permission';
import { StringToArrayPipe } from 'src/utils/stringToArray.pipe';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionAuthGuard } from '../auth/guard/permission-auth.guard';
import { Permissions } from '../auth/decorator/permission.decorator';
import { GetUser } from '../users/decorator/get-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, PermissionAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Permissions(PERMISSION_AUTH.PERMISSION.CREATE)
  create(
    @Body(ValidationPipe) createPermissionDto: CreatePermissionDto,
    @GetUser() user: User,
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @Permissions(PERMISSION_AUTH.PERMISSION.VIEW.ALL)
  findAll(@GetUser() user: User) {
    return this.permissionsService.findAll(user);
  }

  @Get(':ids')
  @Permissions(PERMISSION_AUTH.PERMISSION.VIEW.MULTIPLE)
  findMultiple(
    @Param('ids', new StringToArrayPipe(',', { isUUID: true }))
    ids: UUIDTypes[],
    @GetUser() user: User,
  ) {
    return this.permissionsService.findMultiple(ids, user);
  }

  @Patch(':id')
  @Permissions(PERMISSION_AUTH.PERMISSION.UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @Body(ValidationPipe) updatePermissionDto: UpdatePermissionDto,
    @GetUser() user: User,
  ) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @Permissions(PERMISSION_AUTH.ALL)
  remove(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @GetUser() user: User,
  ) {
    return this.permissionsService.remove(id, user);
  }
}
