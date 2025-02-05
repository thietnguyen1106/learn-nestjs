import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
  ParseUUIDPipe,
  StreamableFile,
} from '@nestjs/common';
import { UUIDTypes } from 'uuid';
import { PERMISSION_AUTH } from 'src/config/permission';
import { StringToArrayPipe } from 'src/utils/stringToArray.pipe';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionAuthGuard } from '../auth/guard/permission-auth.guard';
import { GetUser } from '../users/decorator/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Permissions } from '../auth/decorator/permission.decorator';
import { SkipAuth } from '../auth/decorator/skip-auth.decorator';
import { createReadStream } from 'fs';
import { join } from 'path';

@UseGuards(JwtAuthGuard, PermissionAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Permissions(PERMISSION_AUTH.MOVIE.CREATE)
  create(
    @Body(ValidationPipe) createMovieDto: CreateMovieDto,
    @GetUser() user: User,
  ) {
    return this.moviesService.create(createMovieDto, user);
  }

  @Get()
  @Permissions(PERMISSION_AUTH.MOVIE.VIEW.ALL)
  findAll(@GetUser() user: User) {
    return this.moviesService.findAll(user);
  }

  @Get('files')
  @SkipAuth()
  getFile(): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), 'src/assets/videos/3564298-uhd_3840_2160_24fps.mp4'),
    );
    return new StreamableFile(file, { length: 1000 });
  }

  @Get(':ids')
  @Permissions(PERMISSION_AUTH.MOVIE.VIEW.MULTIPLE)
  findMultiple(
    @Param('ids', new StringToArrayPipe(',', { isUUID: true }))
    ids: UUIDTypes[],
    @GetUser() user: User,
  ) {
    return this.moviesService.findMultiple(ids, user);
  }

  @Patch(':id')
  @Permissions(PERMISSION_AUTH.MOVIE.UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @Body(ValidationPipe) updateMovieDto: UpdateMovieDto,
    @GetUser() user: User,
  ) {
    return this.moviesService.update(id, updateMovieDto, user);
  }

  @Delete(':id')
  @Permissions(PERMISSION_AUTH.ALL)
  remove(
    @Param('id', new ParseUUIDPipe()) id: UUIDTypes,
    @GetUser() user: User,
  ) {
    return this.moviesService.remove(id, user);
  }

  @Get('movie/:id')
  @SkipAuth()
  streamMovie(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    return this.moviesService.streamMovie(id, req, res);
  }
}
