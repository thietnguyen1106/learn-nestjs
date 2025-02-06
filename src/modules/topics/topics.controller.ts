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
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionAuthGuard } from '../auth/guard/permission-auth.guard';
import { Permissions } from '../auth/decorator/permission.decorator';
import { GetUser } from '../users/decorator/get-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, PermissionAuthGuard)
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @Permissions(PERMISSION_AUTH.PERMISSION.CREATE)
  create(
    @Body(ValidationPipe) createTopicDto: CreateTopicDto,
    @GetUser() user: User,
  ) {
    return this.topicsService.create(createTopicDto, user);
  }

  @Get()
  @Permissions(PERMISSION_AUTH.PERMISSION.VIEW.ALL)
  findAll(
    @GetUser() user: User,
    @Query('isSkipRelations') isSkipRelations: string,
  ) {
    return this.topicsService.findAll(user, isSkipRelations === 'true');
  }

  @Get(':ids')
  @Permissions(PERMISSION_AUTH.PERMISSION.VIEW.MULTIPLE)
  findMultiple(
    @Param('ids', new StringToArrayPipe(',', { isUUID: true }))
    ids: UUIDTypes[],
    @GetUser() user: User,
    @Query('isSkipRelations') isSkipRelations: string,
  ) {
    return this.topicsService.findMultiple(
      ids,
      user,
      isSkipRelations === 'true',
    );
  }

  @Patch(':id')
  @Permissions(PERMISSION_AUTH.PERMISSION.UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @Body(ValidationPipe) updateTopicDto: UpdateTopicDto,
    @GetUser() user: User,
  ) {
    return this.topicsService.update(id, updateTopicDto, user);
  }

  @Delete(':id')
  @Permissions(PERMISSION_AUTH.ALL)
  remove(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @GetUser() user: User,
  ) {
    return this.topicsService.remove(id, user);
  }
}
