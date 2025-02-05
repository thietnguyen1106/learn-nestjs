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
  Query,
} from '@nestjs/common';
import { UUIDTypes } from 'uuid';
import { PERMISSION_AUTH } from 'src/config/permission';
import { StringToArrayPipe } from 'src/utils/stringToArray.pipe';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permissions } from '../auth/decorator/permission.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionAuthGuard } from '../auth/guard/permission-auth.guard';
import { GetUser } from '../users/decorator/get-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, PermissionAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(PERMISSION_AUTH.ROLE.CREATE)
  create(
    @Body(ValidationPipe) createRoleDto: CreateRoleDto,
    @GetUser() user: User,
  ) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @Permissions(PERMISSION_AUTH.ROLE.VIEW.ALL)
  findAll(
    @GetUser() user: User,
    @Query('isSkipRelations') isSkipRelations: string,
  ) {
    return this.rolesService.findAll(user, isSkipRelations === 'true');
  }

  @Get(':ids')
  @Permissions(PERMISSION_AUTH.ROLE.VIEW.MULTIPLE)
  findMultiple(
    @Param('ids', new StringToArrayPipe(',', { isUUID: true }))
    ids: UUIDTypes[],
    @GetUser() user: User,
    @Query('isSkipRelations') isSkipRelations: string,
  ) {
    return this.rolesService.findMultiple(
      ids,
      user,
      isSkipRelations === 'true',
    );
  }

  @Patch(':id')
  @Permissions(PERMISSION_AUTH.ROLE.UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @Body(ValidationPipe) updateRoleDto: UpdateRoleDto,
    @GetUser() user: User,
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @Permissions(PERMISSION_AUTH.ALL)
  remove(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @GetUser() user: User,
  ) {
    return this.rolesService.remove(id, user);
  }
}
