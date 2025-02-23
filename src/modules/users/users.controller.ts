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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionAuthGuard } from '../auth/guard/permission-auth.guard';
import { Permissions } from '../auth/decorator/permission.decorator';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './entities/user.entity';

@UseGuards(JwtAuthGuard, PermissionAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions(PERMISSION_AUTH.USER.CREATE)
  create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @GetUser() user: User,
  ) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @Permissions(PERMISSION_AUTH.USER.VIEW.ALL)
  findAll(
    @GetUser() user: User,
    @Query('isSkipRelations') isSkipRelations: string,
    @Query('isSkipSensitives') isSkipSensitives: string,
  ) {
    return this.usersService.findAll({
      isSkipRelations: isSkipRelations === 'true',
      isSkipSensitives: !(isSkipSensitives === 'false'),
      user,
    });
  }

  @Get(':ids')
  @Permissions(PERMISSION_AUTH.USER.VIEW.MULTIPLE)
  findMultiple(
    @Param('ids', new StringToArrayPipe(',', { isUUID: true }))
    ids: UUIDTypes[],
    @GetUser() user: User,
    @Query('isSkipRelations') isSkipRelations: string,
    @Query('isSkipSensitives') isSkipSensitives: string,
  ) {
    return this.usersService.findMultiple({
      ids,
      isSkipRelations: isSkipRelations === 'true',
      isSkipSensitives: !(isSkipSensitives === 'false'),
      user,
    });
  }

  @Patch(':id')
  @Permissions(PERMISSION_AUTH.USER.UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @Permissions(PERMISSION_AUTH.ALL)
  remove(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @GetUser() user: User,
  ) {
    return this.usersService.remove(id, user);
  }
}
