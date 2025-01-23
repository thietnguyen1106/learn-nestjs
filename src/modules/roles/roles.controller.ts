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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permissions } from '../auth/decorator/permission.decorator';
import { PERMISSION_AUTH } from 'src/config/permission';
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
  findAll(@GetUser() user: User) {
    return this.rolesService.findAll(user);
  }

  @Get(':ids')
  @Permissions(PERMISSION_AUTH.ROLE.VIEW.MULTIPLE)
  findMultiple(@Param('ids') ids: string[], @GetUser() user: User) {
    return this.rolesService.findMultiple(ids, user);
  }

  @Patch(':id')
  @Permissions(PERMISSION_AUTH.ROLE.UPDATE)
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateRoleDto: UpdateRoleDto,
    @GetUser() user: User,
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @Permissions(PERMISSION_AUTH.ALL)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.rolesService.remove(id, user);
  }
}
