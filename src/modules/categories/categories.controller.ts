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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionAuthGuard } from '../auth/guard/permission-auth.guard';
import { Permissions } from '../auth/decorator/permission.decorator';
import { GetUser } from '../users/decorator/get-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, PermissionAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Permissions(PERMISSION_AUTH.PERMISSION.CREATE)
  create(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
    @GetUser() user: User,
  ) {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  @Permissions(PERMISSION_AUTH.PERMISSION.VIEW.ALL)
  findAll(
    @GetUser() user: User,
    @Query('isSkipRelations') isSkipRelations: string,
  ) {
    return this.categoriesService.findAll(user, isSkipRelations === 'true');
  }

  @Get(':ids')
  @Permissions(PERMISSION_AUTH.PERMISSION.VIEW.MULTIPLE)
  findMultiple(
    @Param('ids', new StringToArrayPipe(',', { isUUID: true }))
    ids: UUIDTypes[],
    @GetUser() user: User,
    @Query('isSkipRelations') isSkipRelations: string,
  ) {
    return this.categoriesService.findMultiple(
      ids,
      user,
      isSkipRelations === 'true',
    );
  }

  @Patch(':id')
  @Permissions(PERMISSION_AUTH.PERMISSION.UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
    @GetUser() user: User,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, user);
  }

  @Delete(':id')
  @Permissions(PERMISSION_AUTH.ALL)
  remove(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @GetUser() user: User,
  ) {
    return this.categoriesService.remove(id, user);
  }
}
